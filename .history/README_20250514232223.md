# Portfolio Website with PostgreSQL Integration

## Overview
This portfolio website now directly connects to a PostgreSQL database. When the page loads, it automatically:
1. Creates/replaces the necessary database tables
2. Populates them with demo data
3. Retrieves and displays the data from the database

## Features
- **Automatic Database Setup**: No need to manually create tables or insert data
- **Real Database Connection**: Uses actual PostgreSQL queries instead of mock data
- **Complete Portfolio Display**: Shows profile information, skills, and projects from the database

## Prerequisites
- PostgreSQL installed and running
- Database named 'portfolio' created
- Node.js installed (for the pg module)

## Configuration
The database connection is configured in `js/portfolio.js` with these default settings:
```javascript
const dbConfig = {
    user: 'postgres',
    password: '728728',
    host: 'localhost',
    port: 5432,
    database: 'portfolio'
};
```

Modify these settings if your PostgreSQL configuration is different.

## How It Works
1. When the page loads, the `initializeDatabase()` function runs first
2. This function creates all necessary tables and inserts demo data
3. After database initialization, the portfolio data is loaded from the database
4. The `fetchData()` function executes SQL queries to retrieve data for each section

## Database Schema
The database consists of the following tables:
- `profile`: Contains personal information
- `social_links`: Contains social media links
- `skills`: Contains skills with proficiency levels
- `projects`: Contains project information
- `project_tags`: Contains tags for each project

## Usage
Simply open the index.html file in a browser. The JavaScript will handle the database setup and data retrieval automatically.