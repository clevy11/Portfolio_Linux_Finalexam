const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
 user: 'postgres',
 password: '728728',
 host: 'localhost',
 port: 5432,
 database: 'portfolio'
};

const pool = new Pool(dbConfig);

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
 console.error('Database error:', error);
 res.status(500).json({ error: 'Database error' });
 }
});

const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});