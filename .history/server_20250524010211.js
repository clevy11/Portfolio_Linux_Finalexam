const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, './')));

const dbConfig = {
  user: 'admin',
  password: 'password',
  host: 'db',
  port: 5432,
  database: 'portfolios'
};

const pool = new Pool(dbConfig);

// Execute database setup script on startup
const fs = require('fs');
const setupScript = fs.readFileSync(path.join(__dirname, 'db', 'portfolio_setup.sql'), 'utf8');
pool.query(setupScript).then(() => {
    console.log('Database setup completed successfully');
}).catch(err => {
    console.error('Error during database setup:', err);
});

// Profile endpoint
app.get('/api/profile', async (req, res) => {
 try {
 const result = await pool.query(`
 SELECT 
 p.id, 
 p.full_name, 
 p.profession, 
 p.short_bio, 
 p.about, 
 p.profile_pic, 
 p.email, 
 p.phone, 
 p.location,
 json_build_object(
 'linkedin', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'linkedin'),
 'github', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'github'),
 'twitter', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'twitter')
 ) AS social
 FROM profile p
 WHERE p.id = 1;
 `);
 res.json(result.rows[0]);
 } catch (error) {
 console.error('Database error:', error);
 res.status(500).json({ error: 'Database error' });
 }
});

// Skills endpoint
app.get('/api/skills', async (req, res) => {
 try {
 const result = await pool.query(`
 SELECT 
 id,
 name, 
 level, 
 icon
 FROM skills
 ORDER BY level DESC;
 `);
 res.json(result.rows);
 } catch (error) {
 console.error('Database error:', error);
 res.status(500).json({ error: 'Database error' });
 }
});

// Projects endpoint
app.get('/api/projects', async (req, res) => {
 try {
 const result = await pool.query(`
 SELECT * from projects;
 `);
 res.json(result.rows);
 } catch (error) {
 console.error('Database error:', error);
 res.status(500).json({ error: 'Database error' });
 }
});

// Initialize endpoint
app.get('/api/initialize', async (req, res) => {
 try {
 // Initialize database tables
 await pool.query(`
 CREATE TABLE IF NOT EXISTS profile (
 id SERIAL PRIMARY KEY,
 full_name TEXT NOT NULL,
 profession TEXT NOT NULL,
 short_bio TEXT NOT NULL,
 about TEXT NOT NULL,
 profile_pic TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 location TEXT NOT NULL
 );

 CREATE TABLE IF NOT EXISTS social_links (
 id SERIAL PRIMARY KEY,
 profile_id INTEGER REFERENCES profile(id),
 platform TEXT NOT NULL,
 url TEXT NOT NULL
 );

 CREATE TABLE IF NOT EXISTS skills (
 id SERIAL PRIMARY KEY,
 name TEXT NOT NULL,
 level INTEGER NOT NULL,
 icon TEXT NOT NULL
 );

 CREATE TABLE IF NOT EXISTS projects (
 id SERIAL PRIMARY KEY,
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 image TEXT NOT NULL,
 link TEXT NOT NULL
 );

 CREATE TABLE IF NOT EXISTS project_tags (
 id SERIAL PRIMARY KEY,
 project_id INTEGER REFERENCES projects(id),
 tag_name TEXT NOT NULL
 );
 `);

 // Insert demo data
 await pool.query(`
 INSERT INTO profile (full_name, profession, short_bio, about, profile_pic, email, phone, location)
 VALUES ('John Doe', 'Software Engineer', 'Experienced full-stack developer', 'Detailed bio information', 'images/profile.jpg', 'john.doe@example.com', '+1234567890', 'New York, USA');

 INSERT INTO social_links (profile_id, platform, url)
 VALUES (1, 'linkedin', 'https://linkedin.com/in/johndoe'),
 (1, 'github', 'https://github.com/johndoe'),
 (1, 'twitter', 'https://twitter.com/johndoe');

 INSERT INTO skills (name, level, icon)
 VALUES ('JavaScript', 90, 'fab fa-js-square'),
 ('React', 85, 'fab fa-react'),
 ('Node.js', 80, 'fab fa-node');

 INSERT INTO projects (title, description, image, link)
 VALUES ('Project 1', 'First project description', 'images/project1.jpg', 'https://project1.com'),
 ('Project 2', 'Second project description', 'images/project1.jpg', 'https://project2.com');

 INSERT INTO project_tags (project_id, tag_name)
 VALUES (1, 'JavaScript'), (1, 'React'),
 (2, 'Node.js'), (2, 'Express');
 `);

 res.json({ success: true });
 } catch (error) {
 console.error('Initialization error:', error);
 res.status(500).json({ success: false });
 }
});

// Start the server after database connection
pool.connect().then(() => {
    app.listen(3030, () => {
        console.log('Server running on port 3030');
    });
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});