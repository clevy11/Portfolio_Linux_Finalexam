-- Portfolio Database Query Examples

-- Query to fetch profile information
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

-- Query to fetch all skills
SELECT 
    id,
    name, 
    level, 
    icon
FROM skills
ORDER BY level DESC;

-- Query to fetch all projects with their tags
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

-- Example of how to use these queries in Node.js with pg library:
/*
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    password: '728728',
    host: 'localhost',
    port: 5432,
    database: 'portfolio'
});

async function getProfile() {
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
    return result.rows[0];
}

async function getSkills() {
    const result = await pool.query(`
        SELECT 
            id,
            name, 
            level, 
            icon
        FROM skills
        ORDER BY level DESC;
    `);
    return result.rows;
}

async function getProjects() {
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
    return result.rows;
}
*/
