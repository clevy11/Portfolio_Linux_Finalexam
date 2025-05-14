document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data from the server
    async function fetchData(endpoint) {
        try {
            console.log(`Fetching data from ${endpoint}...`);
            const response = await fetch(`/api/${endpoint}.php`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
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

            // Update social links
            if (profile.social) {
                if (profile.social.linkedin) document.getElementById('linkedin').href = profile.social.linkedin;
                if (profile.social.github) document.getElementById('github').href = profile.social.github;
                if (profile.social.twitter) document.getElementById('twitter').href = profile.social.twitter;
            }
        }
    }

    // Load skills
    async function loadSkills() {
        const skills = await fetchData('skills');
        if (skills && skills.length > 0) {
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = '';

            skills.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill';
                skillElement.innerHTML = `
                    <div class="skill-header">
                        <i class="${skill.icon}"></i>
                        <h3>${skill.name}</h3>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-level" style="width: ${skill.level}%"></div>
                    </div>
                `;
                skillsContainer.appendChild(skillElement);
            });
        }
    }

    // Load projects
    async function loadProjects() {
        const projects = await fetchData('projects');
        if (projects && projects.length > 0) {
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = '';

            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project';
                projectElement.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="${project.link}" class="btn" target="_blank">View Project</a>
                    </div>
                `;
                projectsContainer.appendChild(projectElement);
            });
        }
    }

    // Initialize the portfolio
    async function initPortfolio() {
        await Promise.all([
            loadProfile(),
            loadSkills(),
            loadProjects()
        ]);
    }

    // Start loading the portfolio data
    initPortfolio();
}));
