-- Migration to add response_template column to existing webhooks table
-- Run this if your webhooks table doesn't already have the response_template column

-- Check if the column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'webhooks' 
        AND column_name = 'response_template'
    ) THEN
        ALTER TABLE webhooks ADD COLUMN response_template JSONB NULL;
        
        -- Add comment for the new column
        COMMENT ON COLUMN webhooks.response_template IS 'Custom JSON response template to return when webhook is triggered';
        
        RAISE NOTICE 'Added response_template column to webhooks table';
    ELSE
        RAISE NOTICE 'response_template column already exists in webhooks table';
    END IF;
END
$$;