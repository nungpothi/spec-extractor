-- PostgreSQL Database Schema for JSON Preview & Storage Tool

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create specs table
CREATE TABLE IF NOT EXISTS specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary VARCHAR(255) NOT NULL,
    json_data JSONB NOT NULL,
    preview_html TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL
);

-- Create users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_specs_created_at ON specs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_specs_summary ON specs(summary);
CREATE INDEX IF NOT EXISTS idx_specs_created_by ON specs(created_by);
CREATE INDEX IF NOT EXISTS idx_specs_deleted_at ON specs(deleted_at);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Add GIN index for JSONB data
CREATE INDEX IF NOT EXISTS idx_specs_json_data_gin ON specs USING gin(json_data);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_specs_updated_at BEFORE UPDATE ON specs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE specs IS 'Stores JSON specifications and their HTML previews';
COMMENT ON COLUMN specs.summary IS 'Auto-generated summary of the JSON content';
COMMENT ON COLUMN specs.json_data IS 'The original JSON data stored as JSONB';
COMMENT ON COLUMN specs.preview_html IS 'Generated HTML preview of the JSON data';

COMMENT ON TABLE users IS 'User accounts for authentication (future feature)';
COMMENT ON COLUMN users.username IS 'Unique username for login';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for security';
COMMENT ON COLUMN users.email IS 'User email address';