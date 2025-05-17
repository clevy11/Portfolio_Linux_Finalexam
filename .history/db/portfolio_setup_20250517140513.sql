-- Portfolio Database Setup Script

-- CREATE DATABASE portfolio;

-- Connect to the database
-- \c portfolio

-- Create tables if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profile') THEN
        CREATE TABLE profile (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            profession VARCHAR(100) NOT NULL,
            short_bio TEXT NOT NULL,
            about TEXT NOT NULL,
            profile_pic VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            location VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'social_links') THEN
        CREATE TABLE social_links (
            id SERIAL PRIMARY KEY,
            profile_id INTEGER REFERENCES profile(id) ON DELETE CASCADE,
            platform VARCHAR(50) NOT NULL,
            url VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'skills') THEN
        CREATE TABLE skills (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
            icon VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        CREATE TABLE projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            link VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_tags') THEN
        CREATE TABLE project_tags (
            id SERIAL PRIMARY KEY,
            project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
            tag_name VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Example JOIN queries for data retrieval
-- Get all projects with their tags
SELECT p.*, pt.tag_name
FROM projects p
LEFT JOIN project_tags pt ON p.id = pt.project_id;

-- Get all skills with their associated profile
SELECT s.*, p.full_name
FROM skills s
LEFT JOIN profile p ON s.id = p.id;

-- Get all social links with profile information
SELECT sl.*, p.full_name, p.profession
FROM social_links sl
LEFT JOIN profile p ON sl.profile_id = p.id;


-- Insert demo data only if tables are empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profile) THEN
        INSERT INTO profile (full_name, profession, short_bio, about, profile_pic, email, phone, location)
        VALUES ('Buntu Levy Cale', 'Web Developer', 'Passionate full-stack developer', 'Detailed about section...', 'profile.jpg', 'buntu@example.com', '+123456789', 'South Africa');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills) THEN
        INSERT INTO skills (name, level, icon)
        VALUES 
            ('JavaScript', 90, 'fab fa-js'),
            ('React', 85, 'fab fa-react'),
            ('Node.js', 80, 'fab fa-node'),
            ('PHP', 75, 'fab fa-php'),
            ('PostgreSQL', 70, 'fas fa-database');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM projects) THEN
        INSERT INTO projects (title, description, image, link)
        VALUES 
            ('Portfolio Website', 'Modern responsive portfolio showcasing web development skills', 'project1.jpg', 'https://portfolio.example.com'),
            ('E-commerce Platform', 'Full-featured online shopping system', 'project2.jpg', 'https://ecommerce.example.com'),
            ('Task Management App', 'Collaborative task management solution', 'project3.jpg', 'https://tasks.example.com');
    END IF;
END $$;

-- Example JOIN queries for data retrieval
-- Get all projects with their tags
SELECT p.*, pt.tag_name
FROM projects p
LEFT JOIN project_tags pt ON p.id = pt.project_id;

-- Get all skills with their associated profile
SELECT s.*, p.full_name
FROM skills s
LEFT JOIN profile p ON s.id = p.id;

-- Get all social links with profile information
SELECT sl.*, p.full_name, p.profession
FROM social_links sl
LEFT JOIN profile p ON sl.profile_id = p.id;

