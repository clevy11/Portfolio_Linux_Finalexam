// Example of how to modify portfolio.js to use real PostgreSQL database

document.addEventListener('DOMContentLoaded', function() {
    // Database connection configuration
    const dbConfig = {
        user: 'postgres',
        password: '728728',
        host: 'localhost',
        port: 5432,
        database: 'portfolios'
    };

    // Function to fetch data from the server
    async function fetchData(endpoint) {
        try {
            // In a real application, you would use a server-side API
            // This is a client-side example for demonstration purposes only
            // In production, you should NEVER expose database credentials in client-side code
            
            // For a real implementation, you would create a server with endpoints like:
            // - /api/profile
            // - /api/skills
            // - /api/projects
            // And then fetch from those endpoints instead
            
            const response = await fetch(`/api/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
            
            /* 
            Server-side code would look something like this:
            
            // Using Node.js with Express and pg
            const express = require('express');
            const { Pool } = require('pg');
            const app = express();
            
            const pool = new Pool(dbConfig);
            
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
            
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
            */
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // The rest of the portfolio.js code remains the same
    // loadProfile(), loadSkills(), loadProjects(), and initPortfolio() functions
    // would work with the data returned from the server API
});