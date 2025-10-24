-- Add CS2 Trade-Up Calculator tables
CREATE TABLE tradeup_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    knife_price DECIMAL(10,3) NOT NULL,
    result_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL
);

CREATE TABLE tradeup_rarity_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tradeup_id UUID NOT NULL REFERENCES tradeup_calculations(id) ON DELETE CASCADE,
    rarity VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL,
    max_price DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL
);

-- Indexes for better performance
CREATE INDEX idx_tradeup_calculations_created_at ON tradeup_calculations(created_at);
CREATE INDEX idx_tradeup_rarity_results_tradeup_id ON tradeup_rarity_results(tradeup_id);
CREATE INDEX idx_tradeup_rarity_results_rarity ON tradeup_rarity_results(rarity);