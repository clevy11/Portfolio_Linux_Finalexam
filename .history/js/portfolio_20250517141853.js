document.addEventListener('DOMContentLoaded', function() {
    // Database connection configuration
    const apiBaseUrl = 'http://localhost:3000/api';
    
    // Function to fetch data from the server
    async function fetchData(endpoint) {
        try {
            console.log(`Fetching data from ${endpoint}...`);
            const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (!data) {
                throw new Error('No data received from server');
            }
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Display error message to user
            const errorContainer = document.getElementById('error-container');
            if (errorContainer) {
                errorContainer.textContent = 'Failed to load data. Please try again later.';
                errorContainer.style.display = 'block';
            }
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
            document.getElementById('profile-pic').src = profile.profile_pic || 'images/passport_picture.jpg';
            document.getElementById('profile-pic').onerror = function() {
                this.src = 'images/passport_picture.jpg';
            };
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
        
        if (!projects || !Array.isArray(projects)) {
            projectsContainer.innerHTML = '<p>No projects found.</p>';
            return;
        }
        if (projects.length > 0) {
            // Clear loading message
            projectsContainer.innerHTML = '';
            
            // Add projects to the container
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Create tags HTML
                const tagsHTML = project.tags && Array.isArray(project.tags) ? project.tags.map(tag => 
                    `<span class="project-tag">${tag}</span>`
                ).join('') : '';
                
                projectCard.innerHTML = `
                    <img src="${project.image || 'images/default-project.jpg'}" onerror="this.src=''" alt="${project.title}" class="project-image">
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
        // Load data from the database
        await loadProfile();
        await loadSkills();
        await loadProjects();
    }

    // Start loading data
    initPortfolio();
});