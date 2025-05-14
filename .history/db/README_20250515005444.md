# Portfolio Website Database Setup

This directory contains the necessary SQL scripts to set up and query the PostgreSQL database for the portfolio website.

## Files

- `portfolio_setup.sql`: Contains the database schema creation and demo data insertion
- `portfolio_queries.sql`: Contains example queries to fetch data from the database
- `portfolio_js_example.js`: Shows how to modify the main portfolio.js file to use a real database

## Database Setup Instructions

1. Install PostgreSQL if you haven't already
2. Create a new database named "portfolio"
   ```
   CREATE DATABASE portfolio;
   ```
3. Connect to the database
   ```
   \c portfolio
   ```
4. Run the setup script
   ```
   \i /path/to/portfolio_setup.sql
   ```

## Database Structure

The database consists of the following tables:

- **profile**: Contains personal information
- **social_links**: Contains social media links associated with a profile
- **skills**: Contains skills with proficiency levels and icons
- **projects**: Contains portfolio projects
- **project_tags**: Contains tags associated with projects

## Integration with the Website

To use the database with the portfolio website:

1. Set up a backend server (Node.js with Express is recommended)
2. Create API endpoints that execute the queries in `portfolio_queries.sql`
3. Modify the frontend code as shown in `portfolio_js_example.js` to fetch data from these endpoints

## Database Configuration

The database connection configuration is:

```javascript
const dbConfig = {
    user: 'postgres',
    password: '728728',
    host: 'localhost',
    port: 5432,
    database: 'portfolio'
};
```

## Security Note

In a production environment:

- Never expose database credentials in client-side code
- Use environment variables for sensitive information
- Implement proper authentication and authorization
- Consider using an ORM like Sequelize or TypeORM for added security