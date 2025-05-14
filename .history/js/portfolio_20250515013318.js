document.addEventListener('DOMContentLoaded', function() {
    // Database connection configuration
    const apiBaseUrl = 'http://localhost:3000/api';
    
    // Initialize the database with tables and demo data
    async function initializeDatabase() {
        try {
            const response = await fetch(`${apiBaseUrl}/initialize`);
            if (!response.ok) {
                throw new Error(`Initialization failed with status: ${response.status}`);
            }
            const data = await response.json();
            return data.success;
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
            document.getElementById('profile-pic').src = profile.profile_pic || 'images/';
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
                    <img src="${project.image || 'images/default-project.jpg'}" alt="${project.title}" class="project-image" onerror="this.src='images/default-project.jpg'">
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