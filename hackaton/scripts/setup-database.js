require('dotenv').config();
const { Client } = require('pg');
const { AWS_CONFIG } = require('../app/config/aws');

async function setupDatabase() {
  const client = new Client({
    host: AWS_CONFIG.endpoint,
    port: AWS_CONFIG.port,
    database: AWS_CONFIG.database,
    user: AWS_CONFIG.credentials.accessKeyId,
    password: AWS_CONFIG.credentials.secretAccessKey,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created users table');

    // Create watchlist table
    await client.query(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        image TEXT,
        description TEXT,
        rating DECIMAL(3,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created watchlist table');

    // Create user preferences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        image TEXT,
        description TEXT,
        rating DECIMAL(3,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created user preferences table');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 