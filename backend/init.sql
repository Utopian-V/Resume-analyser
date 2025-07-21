-- Database initialization script for PrepNexus
-- This creates the proper schema for production use

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(500),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft',
    slug VARCHAR(255) UNIQUE,
    meta_description TEXT,
    view_count INTEGER DEFAULT 0,
    avatar VARCHAR(500),
    date DATE DEFAULT CURRENT_DATE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user'
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    requirements TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Create optimized indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author);
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_blogs_status_created_at ON blogs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(created_at DESC) WHERE status = 'published';

-- User and job indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO blogs (title, author, content, tags, status, slug) VALUES
('Welcome to PrepNexus', 'Admin', 'Welcome to our AI-powered career preparation platform!', ARRAY['welcome', 'getting-started'], 'published', 'welcome-to-prepnexus'),
('Getting Started with DSA', 'Admin', 'Learn the fundamentals of Data Structures and Algorithms.', ARRAY['dsa', 'algorithms', 'beginner'], 'published', 'getting-started-with-dsa'),
('Interview Preparation Guide', 'Admin', 'Comprehensive guide to ace your technical interviews.', ARRAY['interview', 'career', 'preparation'], 'published', 'interview-preparation-guide')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (email, name, role) VALUES
('admin@prepnexus.com', 'Admin User', 'admin'),
('john@example.com', 'John Doe', 'user'),
('jane@example.com', 'Jane Smith', 'user')
ON CONFLICT (email) DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW published_blogs AS
SELECT id, title, author, content, image, tags, created_at, updated_at, slug, meta_description, view_count
FROM blogs
WHERE status = 'published'
ORDER BY created_at DESC;

-- Grant permissions (adjust as needed)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres; 