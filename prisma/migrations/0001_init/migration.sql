-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending', 'active', 'suspended', 'closed');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'published', 'funded', 'in_progress', 'completed', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "TxnType" AS ENUM ('deposit', 'withdrawal', 'investment', 'refund', 'profit_distribution', 'fee', 'adjustment');

-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('pending', 'completed', 'failed', 'reversed');

-- CreateTable
CREATE TABLE "organizations" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" TEXT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'SAR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "organization_id" BIGINT NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" TEXT NOT NULL,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" BIGSERIAL NOT NULL,
    "organization_id" BIGINT NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "category_id" BIGINT,
    "title" VARCHAR(200) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "region" VARCHAR(80),
    "total_cost" DECIMAL(18,2) NOT NULL,
    "total_shares" DECIMAL(20,4) NOT NULL,
    "share_price" DECIMAL(18,2) NOT NULL,
    "funded_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "risk_level" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" BIGSERIAL NOT NULL,
    "organization_id" BIGINT NOT NULL,
    "investor_id" BIGINT NOT NULL,
    "project_id" BIGINT NOT NULL,
    "shares" DECIMAL(20,4) NOT NULL,
    "share_price" DECIMAL(18,2) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'pending',
    "invested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'SAR',
    "balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "locked_balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" BIGSERIAL NOT NULL,
    "wallet_id" BIGINT NOT NULL,
    "txn_type" "TxnType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "balance_after" DECIMAL(18,2) NOT NULL,
    "status" "TxnStatus" NOT NULL DEFAULT 'completed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_email_key" ON "users"("organization_id", "email");

-- CreateIndex
CREATE INDEX "projects_organization_id_status_idx" ON "projects"("organization_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "projects_organization_id_slug_key" ON "projects"("organization_id", "slug");

-- CreateIndex
CREATE INDEX "investments_investor_id_invested_at_idx" ON "investments"("investor_id", "invested_at");

-- CreateIndex
CREATE INDEX "investments_project_id_idx" ON "investments"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_currency_code_key" ON "wallets"("user_id", "currency_code");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_created_at_idx" ON "wallet_transactions"("wallet_id", "created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

