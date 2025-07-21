-- Migration script to add missing columns to blogs table
-- Run this script to update existing databases

-- Add avatar column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'avatar') THEN
        ALTER TABLE blogs ADD COLUMN avatar VARCHAR(500);
        RAISE NOTICE 'Added avatar column to blogs table';
    ELSE
        RAISE NOTICE 'avatar column already exists in blogs table';
    END IF;
END $$;

-- Add date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'date') THEN
        ALTER TABLE blogs ADD COLUMN date DATE DEFAULT CURRENT_DATE;
        RAISE NOTICE 'Added date column to blogs table';
    ELSE
        RAISE NOTICE 'date column already exists in blogs table';
    END IF;
END $$;

-- Update existing blogs to have proper status
UPDATE blogs SET status = 'published' WHERE status IS NULL;

-- Update existing blogs to have proper date if null
UPDATE blogs SET date = created_at::date WHERE date IS NULL;

-- Add any missing indexes
CREATE INDEX IF NOT EXISTS idx_blogs_avatar ON blogs(avatar);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blogs' 
ORDER BY ordinal_position; 