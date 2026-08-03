# Database Schema (PostgreSQL)

This document outlines the core relational database schema for the MVP, following PostgreSQL best practices (e.g., using `UUID` for primary keys, `TIMESTAMPTZ` for dates, and `JSONB` for flexible data payloads).

## 1. Tables & Definitions

### `organizations`
Represents the tenant/workspace.
- `id` (UUID, PK)
- `name` (VARCHAR, NOT NULL)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())
- `deleted_at` (TIMESTAMPTZ, NULL) - *Soft delete*

### `users`
Represents individual accounts within an organization.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password_hash` (VARCHAR, NOT NULL)
- `role` (VARCHAR, DEFAULT 'MEMBER') - e.g., 'ADMIN', 'MEMBER'
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### `billing`
Manages Stripe subscription mapping per organization.
- `id` (UUID, PK)
- `org_id` (UUID, UNIQUE, FK -> organizations.id, NOT NULL)
- `stripe_customer_id` (VARCHAR, UNIQUE)
- `stripe_subscription_id` (VARCHAR, UNIQUE)
- `plan_tier` (VARCHAR, NOT NULL) - e.g., 'FREE', 'STARTER', 'PRO'
- `status` (VARCHAR, NOT NULL) - e.g., 'ACTIVE', 'CANCELED', 'PAST_DUE'
- `current_period_end` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### `credits`
Tracks the usage and balance of expensive actions per organization.
- `id` (UUID, PK)
- `org_id` (UUID, UNIQUE, FK -> organizations.id, NOT NULL)
- `balance` (INTEGER, DEFAULT 0, CHECK balance >= 0)
- `reset_date` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### `companies`
Global repository of enriched company data. This table is **shared across all organizations** to prevent redundant scraping.
- `id` (UUID, PK)
- `domain` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `industry` (VARCHAR)
- `employee_count` (INTEGER)
- `location` (VARCHAR)
- `last_enriched_at` (TIMESTAMPTZ) - Tracks when we last scraped/updated this data
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### `contacts`
Global repository of enriched decision-makers linked to companies. Also shared.
- `id` (UUID, PK)
- `company_id` (UUID, FK -> companies.id, NOT NULL)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `title` (VARCHAR)
- `email` (VARCHAR, NOT NULL)
- `linkedin_url` (VARCHAR)
- `verification_status` (VARCHAR) - e.g., 'VERIFIED', 'GUESS', 'CATCH_ALL'
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
*Constraint: UNIQUE(company_id, email)*

### `searches`
Log of discovery searches performed by users for historical tracking and auditing.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `user_id` (UUID, FK -> users.id, NOT NULL)
- `criteria` (JSONB, NOT NULL) - e.g., `{"industry": "software", "headcount": "10-50"}`
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### `lead_lists`
A folder/list created by an organization to group targeted contacts.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### `lead_list_contacts` (Join Table)
Links global contacts to an organization's specific lead list.
- `list_id` (UUID, FK -> lead_lists.id, NOT NULL)
- `contact_id` (UUID, FK -> contacts.id, NOT NULL)
- `status` (VARCHAR, DEFAULT 'ADDED') - e.g., 'ADDED', 'DRAFTED', 'EXPORTED'
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
*Primary Key: (list_id, contact_id)*

### `ai_insights`
Stores the outputs of the LLM. This is scoped to the organization because AI drafts are generated using the org's unique Value Proposition.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `contact_id` (UUID, FK -> contacts.id, NULL) - Can be null if it's just a company summary
- `company_id` (UUID, FK -> companies.id, NULL)
- `type` (VARCHAR, NOT NULL) - e.g., 'COMPANY_SUMMARY', 'EMAIL_DRAFT'
- `generated_content` (TEXT, NOT NULL)
- `prompt_context` (JSONB) - Stores what was fed to the LLM (for debugging/quality control)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### `exports`
Tracks when a user exports a Lead List to CSV.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `user_id` (UUID, FK -> users.id, NOT NULL)
- `list_id` (UUID, FK -> lead_lists.id, NOT NULL)
- `s3_file_url` (VARCHAR, NOT NULL)
- `record_count` (INTEGER)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### `audit_logs`
Security and compliance log for all significant actions (mutations).
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations.id, NOT NULL)
- `user_id` (UUID, FK -> users.id, NULL) - Null for system actions
- `action` (VARCHAR, NOT NULL) - e.g., 'USER_INVITED', 'CREDITS_DEDUCTED', 'LIST_EXPORTED'
- `entity_type` (VARCHAR, NOT NULL) - e.g., 'USER', 'CREDITS'
- `entity_id` (UUID)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

## 2. Relationships Summary
- `Organization` 1:M `Users`
- `Organization` 1:1 `Billing`
- `Organization` 1:1 `Credits`
- `Organization` 1:M `LeadLists`
- `Organization` 1:M `AIInsights`
- `Company` 1:M `Contacts`
- `LeadList` M:N `Contacts` (via `lead_list_contacts`)

## 3. Recommended Indexes
To ensure fast lookups, especially as the global `companies` and `contacts` tables grow, the following indexes are required:
- **Foreign Keys:** Create B-Tree indexes on all Foreign Keys (e.g., `users.org_id`, `contacts.company_id`, `ai_insights.org_id`) to prevent full table scans during JOINs.
- **Unique Constraints:** `users.email`, `companies.domain`, `billing.stripe_customer_id`. (PostgreSQL automatically creates unique indexes for these).
- **JSONB Searching:** Add a GIN (Generalized Inverted Index) on `searches.criteria` and `ai_insights.prompt_context` if we plan to query deeply inside the JSON structures.
  ```sql
  CREATE INDEX idx_searches_criteria ON searches USING GIN (criteria);
  ```
- **Time Series / Sorting:** Index `created_at` on `audit_logs` and `exports` for fast pagination and chronological sorting.

## 4. Crucial Constraints
- **Referential Integrity:** All foreign keys must use `ON DELETE CASCADE` or `ON DELETE RESTRICT` based on domain rules (e.g., deleting a `LeadList` cascades to `lead_list_contacts`, but you cannot delete a `Company` if `Contacts` reference it).
- **Credit Protection:** 
  ```sql
  ALTER TABLE credits ADD CONSTRAINT check_positive_balance CHECK (balance >= 0);
  ```
  This ensures the database layer prevents negative credits, acting as a final safeguard against race conditions in the application layer.
