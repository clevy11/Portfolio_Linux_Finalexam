document.addEventListener('DOMContentLoaded', function() {
    // Database connection configuration
    const dbConfig = {
        user: 'postgres',
        password: '728728',
        host: 'localhost',
        port: 5432,
        database: 'portfolio'
    };

    // Function to fetch data from the server
    async function fetchData(endpoint) {
        try {
            // In a real application, this would be an actual API call
            // For this demo, we'll simulate the database data
            
            // Simulated database data
            const mockData = {
                profile: {
                    full_name: 'John Doe',
                    profession: 'Full Stack Developer',
                    short_bio: 'Passionate developer with expertise in web technologies and a love for creating responsive, user-friendly applications.',
                    about: 'I am a full-stack developer with over 5 years of experience building web applications. I specialize in JavaScript, Python, and modern web frameworks. My passion lies in creating clean, efficient code and delivering exceptional user experiences. When I\'m not coding, you can find me hiking, reading tech blogs, or experimenting with new technologies.',
                    profile_pic: 'https://randomuser.me/api/portraits/men/32.jpg',
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    location: 'New York, NY',
                    social: {
                        linkedin: 'https://linkedin.com/in/johndoe',
                        github: 'https://github.com/johndoe',
                        twitter: 'https://twitter.com/johndoe'
                    }
                },
                skills: [
                    { name: 'JavaScript', level: 90, icon: 'fab fa-js' },
                    { name: 'HTML5', level: 95, icon: 'fab fa-html5' },
                    { name: 'CSS3', level: 85, icon: 'fab fa-css3-alt' },
                    { name: 'React', level: 80, icon: 'fab fa-react' },
                    { name: 'Node.js', level: 75, icon: 'fab fa-node-js' },
                    { name: 'Python', level: 70, icon: 'fab fa-python' },
                    { name: 'Git', level: 85, icon: 'fab fa-git-alt' },
                    { name: 'Database', level: 80, icon: 'fas fa-database' }
                ],
                projects: [
                    {
                        title: 'E-commerce Platform',
                        description: 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.',
                        image: 'https://via.placeholder.com/300x200?text=E-commerce+Project',
                        tags: ['React', 'Node.js', 'MongoDB', 'Express'],
                        link: '#'
                    },
                    {
                        title: 'Task Management App',
                        description: 'A productivity application for managing tasks, projects, and team collaboration.',
                        image: 'https://via.placeholder.com/300x200?text=Task+Management',
                        tags: ['Vue.js', 'Firebase', 'Vuetify'],
                        link: '#'
                    },
                    {
                        title: 'Weather Dashboard',
                        description: 'Real-time weather application with forecast data, location search, and interactive maps.',
                        image: 'https://via.placeholder.com/300x200?text=Weather+App',
                        tags: ['JavaScript', 'API Integration', 'CSS3'],
                        link: '#'
                    },
                    {
                        title: 'Portfolio Website',
                        description: 'A responsive portfolio website with dark/light theme switching and dynamic content loading.',
                        image: 'https://via.placeholder.com/300x200?text=Portfolio',
                        tags: ['HTML5', 'CSS3', 'JavaScript', 'PostgreSQL'],
                        link: '#'
                    }
                ]
            };

            // In a real application, we would connect to PostgreSQL here
            // For demonstration, we'll use the mock data
            // const { Pool } = require('pg');
            // const pool = new Pool(dbConfig);
            // const result = await pool.query('SELECT * FROM ' + endpoint);
            // return result.rows;

            return mockData[endpoint];
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
        await loadProfile();
        await loadSkills();
        await loadProjects();
    }

    // Start loading data
    initPortfolio();
});