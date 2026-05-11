CREATE TABLE users (
    id UUID Default gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE buckets (
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    bucket_type VARCHAR(50) NOT NULL,
    target_percentage NUMERIC (5,2) NOT NULL,
    alert_threshold NUMERIC (5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_buckets_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE categories(
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    bucket_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_categories_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    
    CONSTRAINT fk_categories_bucket_id FOREIGN KEY (bucket_id) REFERENCES buckets(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id UUID,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    merchant VARCHAR (255),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_transactions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE savings_goals (
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    bucket_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount NUMERIC(10, 2) NOT NULL,
    current_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_savings_goals_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_savings_goals_bucket_id FOREIGN KEY (bucket_id) REFERENCES buckets(id) ON DELETE CASCADE
);

    CREATE TABLE income (
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    source VARCHAR (255),
    frequency VARCHAR(50) NOT NULL,
    income_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_income_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE debts (
    id UUID default gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    current_balance NUMERIC(10, 2) NOT NULL,
    apr NUMERIC(5, 2) NOT NULL,
    minimum_payment NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_debts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);