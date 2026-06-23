-- =====================================================================
--  02_indexes.sql — Indexes for performance & scale
-- =====================================================================
BEGIN;

-- Tenancy & frequent filters
CREATE INDEX idx_users_org            ON users(organization_id);
CREATE INDEX idx_users_status         ON users(account_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email_trgm     ON users USING gin (email gin_trgm_ops);

CREATE INDEX idx_user_roles_role      ON user_roles(role_id);
CREATE INDEX idx_role_perms_perm      ON role_permissions(permission_id);

-- Projects: list/browse, owner dashboards, search
CREATE INDEX idx_projects_org_status  ON projects(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_owner       ON projects(owner_id);
CREATE INDEX idx_projects_category    ON projects(category_id);
CREATE INDEX idx_projects_title_trgm  ON projects USING gin (title gin_trgm_ops);
CREATE INDEX idx_projects_published   ON projects(published_at DESC) WHERE status = 'published';

CREATE INDEX idx_project_images_proj  ON project_images(project_id);
CREATE INDEX idx_project_docs_proj    ON project_documents(project_id);
CREATE INDEX idx_project_updates_proj ON project_updates(project_id, created_at DESC);

-- Investment hot paths
CREATE INDEX idx_investments_investor ON investments(investor_id, invested_at DESC);
CREATE INDEX idx_investments_project  ON investments(project_id);
CREATE INDEX idx_investments_org      ON investments(organization_id);
CREATE INDEX idx_investments_status   ON investments(status);
CREATE INDEX idx_inv_txn_investment   ON investment_transactions(investment_id, created_at DESC);
CREATE INDEX idx_funding_rounds_proj  ON funding_rounds(project_id, status);
CREATE INDEX idx_shares_project       ON shares(project_id);

-- Finance
CREATE INDEX idx_wallets_user         ON wallets(user_id);
CREATE INDEX idx_wallet_txn_wallet    ON wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX idx_revenues_project     ON project_revenues(project_id);
CREATE INDEX idx_expenses_project     ON project_expenses(project_id);
CREATE INDEX idx_pdist_project        ON profit_distributions(project_id);
CREATE INDEX idx_pdd_investor         ON profit_distribution_details(investor_id);

-- Notifications (unread badge)
CREATE INDEX idx_notif_user_unread    ON notifications(user_id) WHERE is_read = FALSE;

-- Audit / activity (time-series queries)
CREATE INDEX idx_activity_org_time    ON activity_logs(organization_id, created_at DESC);
CREATE INDEX idx_audit_table_record   ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_org_time       ON audit_logs(organization_id, created_at DESC);

-- Training & donors
CREATE INDEX idx_enrollments_user     ON enrollments(user_id);
CREATE INDEX idx_donor_contrib_donor  ON donor_contributions(donor_id);
CREATE INDEX idx_donor_contrib_proj   ON donor_contributions(project_id);

COMMIT;
