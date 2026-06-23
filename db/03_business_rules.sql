-- =====================================================================
--  03_business_rules.sql — Triggers enforcing core business rules
-- =====================================================================
BEGIN;

-- Generic updated_at maintenance
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated   BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_wallets_updated BEFORE UPDATE ON wallets  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inv_updated     BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Rule 1: A project cannot be published before approval.
CREATE OR REPLACE FUNCTION enforce_publish_after_approval() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.approved_at IS NULL THEN
    RAISE EXCEPTION 'Project % cannot be published before approval', NEW.id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_publish_guard BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION enforce_publish_after_approval();

-- Rule 2: Investor cannot buy more shares than available in the round.
CREATE OR REPLACE FUNCTION enforce_share_availability() RETURNS trigger AS $$
DECLARE v_total NUMERIC(20,4); v_issued NUMERIC(20,4);
BEGIN
  SELECT total_shares, issued_shares INTO v_total, v_issued
  FROM shares WHERE project_id = NEW.project_id
    AND (NEW.funding_round_id IS NULL OR funding_round_id = NEW.funding_round_id)
  ORDER BY id LIMIT 1 FOR UPDATE;

  IF v_total IS NULL THEN
    RAISE EXCEPTION 'No share allotment found for project %', NEW.project_id;
  END IF;
  IF v_issued + NEW.shares > v_total THEN
    RAISE EXCEPTION 'Requested % shares exceed available % for project %',
      NEW.shares, (v_total - v_issued), NEW.project_id;
  END IF;

  UPDATE shares SET issued_shares = issued_shares + NEW.shares
  WHERE project_id = NEW.project_id
    AND (NEW.funding_round_id IS NULL OR funding_round_id = NEW.funding_round_id);

  UPDATE projects SET funded_amount = funded_amount + NEW.amount WHERE id = NEW.project_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_share_availability BEFORE INSERT ON investments
  FOR EACH ROW WHEN (NEW.status IN ('pending','confirmed'))
  EXECUTE FUNCTION enforce_share_availability();

-- Rule 3: Cannot distribute profit greater than recorded distributable profit.
CREATE OR REPLACE FUNCTION enforce_distribution_cap() RETURNS trigger AS $$
DECLARE v_sum NUMERIC(18,2); v_distributable NUMERIC(18,2);
BEGIN
  SELECT distributable INTO v_distributable FROM profit_distributions WHERE id = NEW.profit_distribution_id;
  SELECT COALESCE(SUM(amount),0) INTO v_sum FROM profit_distribution_details
    WHERE profit_distribution_id = NEW.profit_distribution_id;
  IF v_sum + NEW.amount > v_distributable THEN
    RAISE EXCEPTION 'Distribution total % exceeds distributable %', v_sum + NEW.amount, v_distributable;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_distribution_cap BEFORE INSERT ON profit_distribution_details
  FOR EACH ROW EXECUTE FUNCTION enforce_distribution_cap();

-- Rule 4: Cannot delete a project that has investments (soft-delete instead).
CREATE OR REPLACE FUNCTION block_project_delete_with_investments() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM investments WHERE project_id = OLD.id) THEN
    RAISE EXCEPTION 'Cannot delete project % — it has investments', OLD.id;
  END IF;
  RETURN OLD;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_block_project_delete BEFORE DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION block_project_delete_with_investments();

-- Rule 5: Cannot suspend/close a user holding incomplete financial operations.
CREATE OR REPLACE FUNCTION block_user_disable_with_pending_finance() RETURNS trigger AS $$
BEGIN
  IF NEW.account_status IN ('suspended','closed')
     AND OLD.account_status NOT IN ('suspended','closed') THEN
    IF EXISTS (
      SELECT 1 FROM investments i
      WHERE i.investor_id = NEW.id AND i.status = 'pending'
    ) OR EXISTS (
      SELECT 1 FROM wallet_transactions wt
      JOIN wallets w ON w.id = wt.wallet_id
      WHERE w.user_id = NEW.id AND wt.status = 'pending'
    ) THEN
      RAISE EXCEPTION 'Cannot disable user % — pending financial operations exist', NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_block_user_disable BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION block_user_disable_with_pending_finance();

-- Generic audit trigger (writes to audit_logs)
CREATE OR REPLACE FUNCTION audit_row_change() RETURNS trigger AS $$
DECLARE v_org BIGINT;
BEGIN
  v_org := COALESCE( (to_jsonb(COALESCE(NEW, OLD)) ->> 'organization_id')::BIGINT, NULL);
  INSERT INTO audit_logs(organization_id, actor_id, table_name, record_id, operation, old_data, new_data)
  VALUES (
    v_org,
    NULLIF(current_setting('app.current_user_id', true), '')::BIGINT,
    TG_TABLE_NAME,
    COALESCE((to_jsonb(NEW)->>'id')::BIGINT, (to_jsonb(OLD)->>'id')::BIGINT),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_projects    AFTER INSERT OR UPDATE OR DELETE ON projects    FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER trg_audit_investments AFTER INSERT OR UPDATE OR DELETE ON investments FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER trg_audit_wallets     AFTER INSERT OR UPDATE OR DELETE ON wallets     FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER trg_audit_pdist       AFTER INSERT OR UPDATE OR DELETE ON profit_distributions FOR EACH ROW EXECUTE FUNCTION audit_row_change();

COMMIT;
