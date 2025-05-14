-- Portfolio Database Setup Script

-- Create database (run this separately if needed)
-- CREATE DATABASE portfolio;

-- Connect to the database
-- \c portfolio

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS social_links;
DROP TABLE IF EXISTS profile;

-- Create profile table
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

-- Create social links table
CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profile(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project tags table (for many-to-many relationship)
CREATE TABLE project_tags (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo data

-- Insert profile data
INSERT INTO profile (full_name, profession, short_bio, about, profile_pic, email, phone, location)
VALUES (
    'John Doe',
    'Full Stack Developer',
    'Passionate developer with expertise in web technologies and a love for creating responsive, user-friendly applications.',
    'I am a full-stack developer with over 5 years of experience building web applications. I specialize in JavaScript, Python, and modern web frameworks. My passion lies in creating clean, efficient code and delivering exceptional user experiences. When I''m not coding, you can find me hiking, reading tech blogs, or experimenting with new technologies.',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'john.doe@example.com',
    '+1 (555) 123-4567',
    'New York, NY'
);

-- Insert social links
INSERT INTO social_links (profile_id, platform, url)
VALUES 
    (1, 'linkedin', 'https://linkedin.com/in/johndoe'),
    (1, 'github', 'https://github.com/johndoe'),
    (1, 'twitter', 'https://twitter.com/johndoe');

-- Insert skills
INSERT INTO skills (name, level, icon)
VALUES 
    ('JavaScript', 90, 'fab fa-js'),
    ('HTML5', 95, 'fab fa-html5'),
    ('CSS3', 85, 'fab fa-css3-alt'),
    ('React', 80, 'fab fa-react'),
    ('Node.js', 75, 'fab fa-node-js'),
    ('Python', 70, 'fab fa-python'),
    ('Git', 85, 'fab fa-git-alt'),
    ('Database', 80, 'fas fa-database');

-- Insert projects
INSERT INTO projects (title, description, image, link)
VALUES 
    ('E-commerce Platform', 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.', 'https://via.placeholder.com/300x200?text=E-commerce+Project', '#'),
    ('Task Management App', 'A productivity application for managing tasks, projects, and team collaboration.', 'https://via.placeholder.com/300x200?text=Task+Management', '#'),
    ('Weather Dashboard', 'Real-time weather application with forecast data, location search, and interactive maps.', 'https://via.placeholder.com/300x200?text=Weather+App', '#'),
    ('Portfolio Website', 'A responsive portfolio website with dark/light theme switching and dynamic content loading.', 'https://via.placeholder.com/300x200?text=Portfolio', '#');

-- Insert project tags
INSERT INTO project_tags (project_id, tag_name)
VALUES
    (1, 'React'),
    (1, 'Node.js'),
    (1, 'MongoDB'),
    (1, 'Express'),
    (2, 'Vue.js'),
    (2, 'Firebase'),
    (2, 'Vuetify'),
    (3, 'JavaScript'),
    (3, 'API Integration'),
    (3, 'CSS3'),
    (4, 'HTML5'),
    (4, 'CSS3'),
    (4, 'JavaScript'),
    (4, 'PostgreSQL');
