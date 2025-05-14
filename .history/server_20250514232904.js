const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Database connection configuration
const dbConfig = {
    user: 'postgres',
    password: '728728',
    host: 'localhost',
    port: 5432,
    database: 'portfolio'
};

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully!');
    }
});

// API endpoint to get profile data
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
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get skills data
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
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get projects data
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.title,
                p.description,
                p.image,
                p.link,
                array_agg(pt.tag_name) AS tags
            FROM projects p
            JOIN project_tags pt ON p.id = pt.project_id
            GROUP BY p.id, p.title, p.description, p.image, p.link
            ORDER BY p.id;
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});