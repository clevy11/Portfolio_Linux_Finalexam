document.addEventListener('DOMContentLoaded', function() {
    // Database connection configuration
    const apiBaseUrl = 'http://localhost:3000/api';
    
    // Initialize the database with tables and demo data
    async function initializeDatabase() {
        return true;
                -- Drop tables if they exist (for clean setup)
                DROP TABLE IF EXISTS project_tags CASCADE;
                DROP TABLE IF EXISTS projects CASCADE;
                DROP TABLE IF EXISTS skills CASCADE;
                DROP TABLE IF EXISTS social_links CASCADE;
                DROP TABLE IF EXISTS profile CASCADE;
                
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
                    location VARCHAR(100) NOT NULL
                );
                
                -- Create social links table
                CREATE TABLE social_links (
                    id SERIAL PRIMARY KEY,
                    profile_id INTEGER REFERENCES profile(id),
                    platform VARCHAR(50) NOT NULL,
                    url VARCHAR(255) NOT NULL
                );
                
                -- Create skills table
                CREATE TABLE skills (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    level INTEGER NOT NULL,
                    icon VARCHAR(50) NOT NULL
                );
                
                -- Create projects table
                CREATE TABLE projects (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    description TEXT NOT NULL,
                    image VARCHAR(255) NOT NULL,
                    link VARCHAR(255) NOT NULL
                );
                
                -- Create project tags table
                CREATE TABLE project_tags (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER REFERENCES projects(id),
                    tag_name VARCHAR(50) NOT NULL
                );
                
                -- Insert demo data into profile
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
                
                -- Insert demo data into social_links
                INSERT INTO social_links (profile_id, platform, url) VALUES
                (1, 'linkedin', 'https://linkedin.com/in/johndoe'),
                (1, 'github', 'https://github.com/johndoe'),
                (1, 'twitter', 'https://twitter.com/johndoe');
                
                -- Insert demo data into skills
                INSERT INTO skills (name, level, icon) VALUES
                ('JavaScript', 90, 'fab fa-js'),
                ('HTML5', 95, 'fab fa-html5'),
                ('CSS3', 85, 'fab fa-css3-alt'),
                ('React', 80, 'fab fa-react'),
                ('Node.js', 75, 'fab fa-node-js'),
                ('Python', 70, 'fab fa-python'),
                ('Git', 85, 'fab fa-git-alt'),
                ('Database', 80, 'fas fa-database');
                
                -- Insert demo data into projects
                INSERT INTO projects (title, description, image, link) VALUES
                ('E-commerce Platform', 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.', 'https://via.placeholder.com/300x200?text=E-commerce+Project', '#'),
                ('Task Management App', 'A productivity application for managing tasks, projects, and team collaboration.', 'https://via.placeholder.com/300x200?text=Task+Management', '#'),
                ('Weather Dashboard', 'Real-time weather application with forecast data, location search, and interactive maps.', 'https://via.placeholder.com/300x200?text=Weather+App', '#'),
                ('Portfolio Website', 'A responsive portfolio website with dark/light theme switching and dynamic content loading.', 'https://via.placeholder.com/300x200?text=Portfolio', '#');
                
                -- Insert demo data into project_tags
                INSERT INTO project_tags (project_id, tag_name) VALUES
                (1, 'React'), (1, 'Node.js'), (1, 'MongoDB'), (1, 'Express'),
                (2, 'Vue.js'), (2, 'Firebase'), (2, 'Vuetify'),
                (3, 'JavaScript'), (3, 'API Integration'), (3, 'CSS3'),
                (4, 'HTML5'), (4, 'CSS3'), (4, 'JavaScript'), (4, 'PostgreSQL');
            `);
            
            console.log('Database initialized successfully!');
            return true;
        } catch (error) {
            console.error('Error initializing database:', error);
            return false;
        }
    }

    // Function to fetch data from the server
    async function fetchData(endpoint) {
        try {
            console.log(`Fetching data from ${endpoint}...`);
            const response = await fetch(`${apiBaseUrl}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
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
            else if (endpoint === 'skills') {
                result = await pool.query(`
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
            else if (endpoint === 'projects') {
                result = await pool.query(`
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
            
            return null;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Load profile information
    async function loadProfile() {
        const profile = await fetchData('profile');
        if (profile) {
            document.getElementById('full-name').textContent = profile.full_name;
            document.getElementById('profession').textContent = profile.profession;
            document.getElementById('short-bio').textContent = profile.short_bio;
            document.getElementById('about-text').textContent = profile.about;
            document.getElementById('profile-pic').src = profile.profile_pic;
            document.getElementById('email').textContent = profile.email;
            document.getElementById('phone').textContent = profile.phone;
            document.getElementById('location').textContent = profile.location;
            document.getElementById('footer-name').textContent = profile.full_name;
            
            // Set social links
            document.getElementById('linkedin').href = profile.social.linkedin;
            document.getElementById('github').href = profile.social.github;
            document.getElementById('twitter').href = profile.social.twitter;
        }
    }

    // Load skills
    async function loadSkills() {
        const skills = await fetchData('skills');
        const skillsContainer = document.getElementById('skills-container');
        
        if (skills && skills.length > 0) {
            // Clear loading message
            skillsContainer.innerHTML = '';
            
            // Add skills to the container
            skills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                
                skillCard.innerHTML = `
                    <div class="skill-icon"><i class="${skill.icon}"></i></div>
                    <h3 class="skill-name">${skill.name}</h3>
                    <div class="skill-level">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                    <p>${skill.level}%</p>
                `;
                
                skillsContainer.appendChild(skillCard);
            });
        }
    }

    // Load projects
    async function loadProjects() {
        const projects = await fetchData('projects');
        const projectsContainer = document.getElementById('projects-container');
        
        if (projects && projects.length > 0) {
            // Clear loading message
            projectsContainer.innerHTML = '';
            
            // Add projects to the container
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Create tags HTML
                const tagsHTML = project.tags.map(tag => 
                    `<span class="project-tag">${tag}</span>`
                ).join('');
                
                projectCard.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">${tagsHTML}</div>
                        <a href="${project.link}" class="project-link" target="_blank">View Project</a>
                    </div>
                `;
                
                projectsContainer.appendChild(projectCard);
            });
        }
    }

    // Initialize the portfolio
    async function initPortfolio() {
        // First initialize the database
        const dbInitialized = await initializeDatabase();
        
        if (dbInitialized) {
            // Then load the data from the database
            await loadProfile();
            await loadSkills();
            await loadProjects();
        } else {
            console.error('Failed to initialize database. Portfolio data will not be loaded.');
        }
    }

    // Start loading data
    initPortfolio();
});