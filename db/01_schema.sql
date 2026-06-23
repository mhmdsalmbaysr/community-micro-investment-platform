-- =====================================================================
--  Community Micro-Investment Platform — PostgreSQL Schema (v1)
--  Production-ready, multi-tenant (SaaS), FinTech-grade design.
--  Target: PostgreSQL 14+
-- =====================================================================
--  Conventions:
--   * snake_case identifiers, plural table names.
--   * Surrogate PK: BIGINT GENERATED ALWAYS AS IDENTITY (or UUID where shareable).
--   * Money: NUMERIC(18,2) — NEVER float. Shares: NUMERIC(20,4).
--   * All tenant-scoped tables carry organization_id (tenant_id) for RLS.
--   * created_at / updated_at on every table; soft-delete via deleted_at.
--   * Timestamps are TIMESTAMPTZ (UTC).
-- =====================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid(), crypt()
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive email
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy search indexes

-- ---------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------
CREATE TYPE account_status   AS ENUM ('pending','active','suspended','closed');
CREATE TYPE project_status   AS ENUM ('draft','submitted','under_review','approved','published','funded','in_progress','completed','rejected','cancelled');
CREATE TYPE investment_status AS ENUM ('pending','confirmed','cancelled','refunded');
CREATE TYPE txn_type         AS ENUM ('deposit','withdrawal','investment','refund','profit_distribution','fee','adjustment');
CREATE TYPE txn_status       AS ENUM ('pending','completed','failed','reversed');
CREATE TYPE doc_status       AS ENUM ('pending','verified','rejected');
CREATE TYPE notif_channel    AS ENUM ('in_app','email','sms','push');
CREATE TYPE funding_round_status AS ENUM ('planned','open','closed','cancelled');

-- =====================================================================
-- 0) MULTI-TENANCY (SaaS)
-- =====================================================================
CREATE TABLE organizations (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid            UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name            VARCHAR(160) NOT NULL,
    slug            CITEXT NOT NULL UNIQUE,
    legal_name      VARCHAR(200),
    country_code    CHAR(2) NOT NULL DEFAULT 'SA',
    currency_code   CHAR(3) NOT NULL DEFAULT 'SAR',
    plan            VARCHAR(40) NOT NULL DEFAULT 'standard',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);
COMMENT ON TABLE organizations IS 'Tenant root. Every business row references organization_id for isolation (RLS).';

-- =====================================================================
-- 1) USERS, RBAC
-- =====================================================================
CREATE TABLE users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid            UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    full_name       VARCHAR(160) NOT NULL,
    email           CITEXT NOT NULL,
    phone           VARCHAR(20),
    password_hash   TEXT NOT NULL,                 -- bcrypt/argon2 hash only
    account_status  account_status NOT NULL DEFAULT 'pending',
    email_verified_at TIMESTAMPTZ,
    last_login_at   TIMESTAMPTZ,
    mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_users_org_email UNIQUE (organization_id, email)
);

CREATE TABLE roles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = system role
    code            VARCHAR(50) NOT NULL,          -- investor, project_owner, platform_admin, finance_officer, auditor
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_org_code UNIQUE (organization_id, code)
);

CREATE TABLE permissions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR(80) NOT NULL UNIQUE,        -- e.g. projects.approve, wallets.withdraw
    description TEXT,
    module      VARCHAR(50) NOT NULL                -- users, projects, investments, finance, admin
);

CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Many-to-many: a user can hold multiple roles.
CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_by BIGINT REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Tenant membership (a user may belong to several orgs in pure SaaS mode).
CREATE TABLE organization_users (
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_owner        BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (organization_id, user_id)
);

-- One-to-one: extended profile.
CREATE TABLE user_profiles (
    user_id       BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    national_id   VARCHAR(40),
    birth_date    DATE,
    gender        VARCHAR(10),
    address_line  VARCHAR(200),
    city          VARCHAR(80),
    country_code  CHAR(2),
    avatar_url    TEXT,
    bio           TEXT,
    kyc_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_documents (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type     VARCHAR(50) NOT NULL,              -- id_card, passport, iban_letter
    file_url     TEXT NOT NULL,
    status       doc_status NOT NULL DEFAULT 'pending',
    reviewed_by  BIGINT REFERENCES users(id),
    reviewed_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 2) PROJECTS
-- =====================================================================
CREATE TABLE project_categories (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    code            VARCHAR(40) NOT NULL,             -- agriculture, livestock, industrial, handicraft, home, services
    name            VARCHAR(100) NOT NULL,
    parent_id       BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
    CONSTRAINT uq_category_org_code UNIQUE (organization_id, code)
);

CREATE TABLE projects (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid             UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    organization_id  BIGINT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    owner_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id      BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
    title            VARCHAR(200) NOT NULL,
    slug             CITEXT NOT NULL,
    description      TEXT,
    region           VARCHAR(80),
    total_cost       NUMERIC(18,2) NOT NULL CHECK (total_cost >= 0),
    duration_months  INT CHECK (duration_months > 0),
    expected_return_rate NUMERIC(5,2) CHECK (expected_return_rate >= 0),   -- annual %
    total_shares     NUMERIC(20,4) NOT NULL CHECK (total_shares > 0),
    share_price      NUMERIC(18,2) NOT NULL CHECK (share_price > 0),
    funded_amount    NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (funded_amount >= 0),
    status           project_status NOT NULL DEFAULT 'draft',
    risk_level       VARCHAR(20),
    approved_by      BIGINT REFERENCES users(id),
    approved_at      TIMESTAMPTZ,
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at       TIMESTAMPTZ,
    CONSTRAINT uq_projects_org_slug UNIQUE (organization_id, slug)
);

CREATE TABLE project_images (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_documents (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    doc_type    VARCHAR(50) NOT NULL,
    file_url    TEXT NOT NULL,
    status      doc_status NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_updates (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    author_id   BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title       VARCHAR(160),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 3) INVESTMENT
-- =====================================================================
CREATE TABLE funding_rounds (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id   BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    round_number INT NOT NULL DEFAULT 1,
    target_amount NUMERIC(18,2) NOT NULL CHECK (target_amount > 0),
    shares_offered NUMERIC(20,4) NOT NULL CHECK (shares_offered > 0),
    share_price   NUMERIC(18,2) NOT NULL CHECK (share_price > 0),
    opens_at      TIMESTAMPTZ,
    closes_at     TIMESTAMPTZ,
    status        funding_round_status NOT NULL DEFAULT 'planned',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_round UNIQUE (project_id, round_number),
    CONSTRAINT ck_round_dates CHECK (closes_at IS NULL OR opens_at IS NULL OR closes_at > opens_at)
);

-- Shares ledger per round (issued / remaining).
CREATE TABLE shares (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    funding_round_id BIGINT REFERENCES funding_rounds(id) ON DELETE CASCADE,
    total_shares    NUMERIC(20,4) NOT NULL CHECK (total_shares > 0),
    issued_shares   NUMERIC(20,4) NOT NULL DEFAULT 0 CHECK (issued_shares >= 0),
    share_price     NUMERIC(18,2) NOT NULL CHECK (share_price > 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_shares_capacity CHECK (issued_shares <= total_shares)
);

CREATE TABLE investments (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid            UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    investor_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    funding_round_id BIGINT REFERENCES funding_rounds(id) ON DELETE SET NULL,
    shares          NUMERIC(20,4) NOT NULL CHECK (shares > 0),
    share_price     NUMERIC(18,2) NOT NULL CHECK (share_price > 0),
    amount          NUMERIC(18,2) NOT NULL CHECK (amount > 0),
    status          investment_status NOT NULL DEFAULT 'pending',
    invested_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Immutable audit trail of every investment lifecycle event.
CREATE TABLE investment_transactions (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investment_id BIGINT NOT NULL REFERENCES investments(id) ON DELETE RESTRICT,
    txn_type      txn_type NOT NULL,
    amount        NUMERIC(18,2) NOT NULL,
    status        txn_status NOT NULL DEFAULT 'pending',
    reference     VARCHAR(80),
    metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Denormalized per-investor history snapshot (fast reads / reporting).
CREATE TABLE investment_history (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investor_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id    BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_shares  NUMERIC(20,4) NOT NULL DEFAULT 0,
    total_invested NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_returns NUMERIC(18,2) NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_inv_history UNIQUE (investor_id, project_id)
);

-- =====================================================================
-- 4) FINANCE (wallets, revenues, expenses, profit distribution)
-- =====================================================================
CREATE TABLE wallets (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    currency_code   CHAR(3) NOT NULL DEFAULT 'SAR',
    balance         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    locked_balance  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (locked_balance >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_wallet_user_ccy UNIQUE (user_id, currency_code)
);

CREATE TABLE wallet_transactions (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    wallet_id    BIGINT NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
    txn_type     txn_type NOT NULL,
    amount       NUMERIC(18,2) NOT NULL,                 -- signed: +credit / -debit
    balance_after NUMERIC(18,2) NOT NULL,
    status       txn_status NOT NULL DEFAULT 'completed',
    reference    VARCHAR(80),
    related_investment_id BIGINT REFERENCES investments(id),
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_revenues (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amount      NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
    source      VARCHAR(120),
    recorded_by BIGINT REFERENCES users(id),
    period_start DATE,
    period_end   DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_expenses (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amount      NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
    category    VARCHAR(120),
    recorded_by BIGINT REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profit_distributions (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    total_profit    NUMERIC(18,2) NOT NULL CHECK (total_profit >= 0),
    distributable   NUMERIC(18,2) NOT NULL CHECK (distributable >= 0),
    distributed_at  TIMESTAMPTZ,
    approved_by     BIGINT REFERENCES users(id),
    status          txn_status NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profit_distribution_details (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profit_distribution_id BIGINT NOT NULL REFERENCES profit_distributions(id) ON DELETE CASCADE,
    investor_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    shares                NUMERIC(20,4) NOT NULL CHECK (shares >= 0),
    amount                NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
    wallet_transaction_id BIGINT REFERENCES wallet_transactions(id),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_pdd UNIQUE (profit_distribution_id, investor_id)
);

CREATE TABLE financial_reports (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id      BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    report_type     VARCHAR(50) NOT NULL,            -- monthly, quarterly, annual
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    data            JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by    BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5) NOTIFICATIONS
-- =====================================================================
CREATE TABLE notifications (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(160) NOT NULL,
    body         TEXT,
    channel      notif_channel NOT NULL DEFAULT 'in_app',
    is_read      BOOLEAN NOT NULL DEFAULT FALSE,
    read_at      TIMESTAMPTZ,
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    notification_id BIGINT REFERENCES notifications(id) ON DELETE SET NULL,
    channel         notif_channel NOT NULL,
    status          VARCHAR(30) NOT NULL,
    error           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE email_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    to_email    CITEXT NOT NULL,
    subject     VARCHAR(200),
    template    VARCHAR(80),
    status      VARCHAR(30) NOT NULL,
    provider_id VARCHAR(120),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sms_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    to_phone    VARCHAR(20) NOT NULL,
    body        TEXT,
    status      VARCHAR(30) NOT NULL,
    provider_id VARCHAR(120),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 6) ADMIN / SETTINGS / AUDIT
-- =====================================================================
CREATE TABLE system_settings (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    key             VARCHAR(100) NOT NULL,
    value           JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by      BIGINT REFERENCES users(id),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_settings UNIQUE (organization_id, key)
);

CREATE TABLE activity_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(60),
    entity_id       BIGINT,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id        BIGINT REFERENCES users(id) ON DELETE SET NULL,
    table_name      VARCHAR(80) NOT NULL,
    record_id       BIGINT,
    operation       VARCHAR(10) NOT NULL,           -- INSERT/UPDATE/DELETE
    old_data        JSONB,
    new_data        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin_actions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action_type VARCHAR(60) NOT NULL,               -- approve_project, suspend_user
    target_type VARCHAR(60),
    target_id   BIGINT,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 7) ENTREPRENEUR TRAINING
-- =====================================================================
CREATE TABLE training_programs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title           VARCHAR(160) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE training_courses (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    program_id  BIGINT NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    title       VARCHAR(160) NOT NULL,
    content_url TEXT,
    duration_hours NUMERIC(6,2),
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_id   BIGINT NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    progress    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    completed_at TIMESTAMPTZ,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_enrollment UNIQUE (course_id, user_id)
);

CREATE TABLE certificates (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    serial_no     VARCHAR(60) NOT NULL UNIQUE,
    issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_url      TEXT
);

-- =====================================================================
-- 8) DONORS
-- =====================================================================
CREATE TABLE donors (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    donor_type      VARCHAR(50),                    -- government, ngo, corporate, individual
    contact_email   CITEXT,
    contact_phone   VARCHAR(20),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE donor_contributions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    donor_id    BIGINT NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    project_id  BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    amount      NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
    currency_code CHAR(3) NOT NULL DEFAULT 'SAR',
    contributed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes       TEXT
);

CREATE TABLE donor_reports (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    donor_id    BIGINT NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end   DATE NOT NULL,
    data        JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_url    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
