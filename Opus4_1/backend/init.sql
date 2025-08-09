-- Database initialization script for ClaimTrack
-- This script creates the database and sets up initial configuration

-- Create the database if it doesn't exist
-- Note: This is handled by the postgres image via POSTGRES_DB

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE claimtrack TO postgres;

-- Create any additional configurations
-- These will be managed by Alembic migrations
