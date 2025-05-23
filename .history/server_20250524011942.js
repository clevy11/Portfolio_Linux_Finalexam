const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

const dbConfig = {
  user: 'postgres',
  password: '728728',
  host: 'localhost',
  port: 5432,
  database: 'portfolios'
};

const pool = new Pool(dbConfig);

// Function to retry database connection
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.connect();
      console.log('Database connected successfully');
      
      // Execute database setup script
      const setupScript = fs.readFileSync(path.join(__dirname, 'db', 'portfolio_setup.sql'), 'utf8');
      await pool.query(setupScript);
      console.log('Database setup completed successfully');
      return true;
    } catch (err) {
      console.log(`Failed to connect to database. Retries left: ${retries}`);
      retries -= 1;
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return false;
};

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
      VALUES (
        'John Doe',
        'Full Stack Developer',
        'Passionate about creating elegant solutions to complex problems',
        'I am a full stack developer with 5 years of experience in web development...',
        '/images/profile.jpg',
        'john@example.com',
        '+1234567890',
        'New York, USA'
      ) ON CONFLICT DO NOTHING;

      INSERT INTO social_links (profile_id, platform, url)
      VALUES 
        (1, 'linkedin', 'https://linkedin.com/in/johndoe'),
        (1, 'github', 'https://github.com/johndoe'),
        (1, 'twitter', 'https://twitter.com/johndoe')
      ON CONFLICT DO NOTHING;

      INSERT INTO skills (name, level, icon)
      VALUES 
        ('JavaScript', 90, 'fab fa-js'),
        ('Python', 85, 'fab fa-python'),
        ('React', 88, 'fab fa-react'),
        ('Node.js', 87, 'fab fa-node')
      ON CONFLICT DO NOTHING;

      INSERT INTO projects (title, description, image, link)
      VALUES 
        ('Project 1', 'A full stack web application', '/images/project1.jpg', 'https://project1.com'),
        ('Project 2', 'Mobile app development', '/images/default-project.jpg', 'https://project2.com')
      ON CONFLICT DO NOTHING;
    `);

    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Database initialization error' });
  }
});

// Start server and initialize database
app.listen(3030, async () => {
  console.log('Server running on port 3030');
  const connected = await connectWithRetry();
  if (!connected) {
    console.error('Failed to connect to database after all retries');
    process.exit(1);
  }
});