-- =====================================================================
--  04_security_rls.sql — Row-Level Security for multi-tenant isolation
-- =====================================================================
-- App sets per-request: SET app.current_org_id = '<id>'; SET app.current_user_id = '<id>';
BEGIN;

CREATE OR REPLACE FUNCTION current_org_id() RETURNS BIGINT AS $$
  SELECT NULLIF(current_setting('app.current_org_id', true), '')::BIGINT;
$$ LANGUAGE sql STABLE;

-- Enable RLS + tenant policy on tenant-scoped tables.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','projects','investments','wallets','financial_reports',
    'system_settings','activity_logs','audit_logs','training_programs',
    'donors','project_categories'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t);
    EXECUTE format($f$
      CREATE POLICY tenant_isolation ON %I
        USING (organization_id = current_org_id())
        WITH CHECK (organization_id = current_org_id());
    $f$, t);
  END LOOP;
END $$;

-- Example application roles (DB roles map to RBAC at app layer).
-- CREATE ROLE app_readonly NOLOGIN; CREATE ROLE app_readwrite NOLOGIN;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

COMMIT;
