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

-- Create users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'VISITOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL,
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'VISITOR'))
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_specs_created_at ON specs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_specs_summary ON specs(summary);
CREATE INDEX IF NOT EXISTS idx_specs_created_by ON specs(created_by);
CREATE INDEX IF NOT EXISTS idx_specs_deleted_at ON specs(deleted_at);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
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

-- Create requirements table
CREATE TABLE IF NOT EXISTS requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'NEW',
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL,
    CONSTRAINT fk_requirements_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_status CHECK (status IN ('NEW', 'IN_PROGRESS', 'DONE'))
);

-- Add indexes for requirements table
CREATE INDEX IF NOT EXISTS idx_requirements_created_by ON requirements(created_by);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
CREATE INDEX IF NOT EXISTS idx_requirements_is_private ON requirements(is_private);
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON requirements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirements_deleted_at ON requirements(deleted_at);

-- Create trigger for requirements updated_at
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for security';
COMMENT ON COLUMN users.email IS 'User email address';
COMMENT ON COLUMN users.role IS 'User role (ADMIN or VISITOR)';

COMMENT ON TABLE requirements IS 'User requirements with privacy and status management';
COMMENT ON COLUMN requirements.content IS 'The requirement text content';
COMMENT ON COLUMN requirements.is_private IS 'Whether the requirement is private (visible only to owner and admins)';
COMMENT ON COLUMN requirements.status IS 'Current status of the requirement (NEW, IN_PROGRESS, DONE)';
COMMENT ON COLUMN requirements.created_by IS 'User who created the requirement';

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uuid_key UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    response_template JSONB NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL,
    CONSTRAINT fk_webhooks_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL,
    method VARCHAR(10) NOT NULL,
    headers JSONB NOT NULL,
    body JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_webhook_logs_webhook_id FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
);

-- Add indexes for webhooks table
CREATE INDEX IF NOT EXISTS idx_webhooks_uuid_key ON webhooks(uuid_key);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_created_at ON webhooks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhooks_deleted_at ON webhooks(deleted_at);

-- Add indexes for webhook_logs table
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_method ON webhook_logs(method);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- Add GIN indexes for JSONB data in webhook_logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_headers_gin ON webhook_logs USING gin(headers);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_body_gin ON webhook_logs USING gin(body);

-- Create trigger for webhooks updated_at
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for webhooks tables
COMMENT ON TABLE webhooks IS 'User-generated webhook endpoints for receiving HTTP requests';
COMMENT ON COLUMN webhooks.uuid_key IS 'Unique UUID used in webhook URL for public access';
COMMENT ON COLUMN webhooks.user_id IS 'User who owns this webhook';
COMMENT ON COLUMN webhooks.response_template IS 'Custom JSON response template to return when webhook is triggered';

COMMENT ON TABLE webhook_logs IS 'Log of all HTTP requests received by webhook endpoints';
COMMENT ON COLUMN webhook_logs.webhook_id IS 'Reference to the webhook that received this request';
COMMENT ON COLUMN webhook_logs.method IS 'HTTP method used in the request';
COMMENT ON COLUMN webhook_logs.headers IS 'HTTP headers received with the request';
COMMENT ON COLUMN webhook_logs.body IS 'Request body data received with the request';