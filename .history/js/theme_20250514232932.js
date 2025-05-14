document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('checkbox');
    const themeLabel = document.querySelector('.theme-label');
    
    // Check for saved theme preference or use preferred color scheme
    const currentTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeSwitch.checked = true;
        themeLabel.textContent = 'Light Mode';
    } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeLabel.textContent = 'Dark Mode';
    }
    
    // Handle theme switch toggle
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Light Mode';
        } else {
            document.body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Dark Mode';
        }
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});