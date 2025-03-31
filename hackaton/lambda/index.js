const { Pool } = require('pg');
const fetch = require('node-fetch');

// Initialize PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1 // Limit to 1 connection for Lambda
});

// Helper function to handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
};

// Helper function to create response
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

// Get all movies
exports.getMovies = async (event) => {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=1f54bd990f1c42b8c92a9e4e3ac23cb7&language=en-US&page=1'
    );
    const data = await response.json();
    
    const formattedMovies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      description: movie.overview,
      rating: movie.vote_average,
    }));

    return createResponse(200, formattedMovies);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to fetch movies' });
  }
};

// User registration
exports.register = async (event) => {
  const client = await pool.connect();
  try {
    const { email, password } = JSON.parse(event.body);
    
    // Check if user already exists
    const userExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return createResponse(400, { error: 'User already exists' });
    }

    // Create new user
    const result = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password] // In production, hash the password!
    );

    return createResponse(201, result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to register user' });
  } finally {
    client.release();
  }
};

// User login
exports.login = async (event) => {
  const client = await pool.connect();
  try {
    const { email, password } = JSON.parse(event.body);
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password] // In production, use proper password comparison!
    );

    if (result.rows.length === 0) {
      return createResponse(401, { error: 'Invalid credentials' });
    }

    return createResponse(200, result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to login' });
  } finally {
    client.release();
  }
};

// Add movie to watchlist
exports.addToWatchlist = async (event) => {
  const client = await pool.connect();
  try {
    const { userId, movieId, title, image, description, rating } = JSON.parse(event.body);
    
    const result = await client.query(
      'INSERT INTO watchlist (user_id, movie_id, title, image, description, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, movieId, title, image, description, rating]
    );

    return createResponse(201, result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to add to watchlist' });
  } finally {
    client.release();
  }
};

// Get user's watchlist
exports.getWatchlist = async (event) => {
  const client = await pool.connect();
  try {
    const { userId } = event.pathParameters;
    
    const result = await client.query(
      'SELECT * FROM watchlist WHERE user_id = $1',
      [userId]
    );

    return createResponse(200, result.rows);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to get watchlist' });
  } finally {
    client.release();
  }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (event) => {
  const client = await pool.connect();
  try {
    const { userId, movieId } = event.pathParameters;
    
    await client.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );

    return createResponse(200, { message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Failed to remove from watchlist' });
  } finally {
    client.release();
  }
};

// Main handler
exports.handler = async (event) => {
  const { httpMethod, path } = event;

  // Handle OPTIONS request for CORS
  if (httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  // Route requests based on path and method
  switch (true) {
    case httpMethod === 'GET' && path === '/movies':
      return exports.getMovies(event);
    case httpMethod === 'POST' && path === '/register':
      return exports.register(event);
    case httpMethod === 'POST' && path === '/login':
      return exports.login(event);
    case httpMethod === 'POST' && path === '/watchlist':
      return exports.addToWatchlist(event);
    case httpMethod === 'GET' && path.match(/^\/watchlist\/\d+$/):
      return exports.getWatchlist(event);
    case httpMethod === 'DELETE' && path.match(/^\/watchlist\/\d+\/\d+$/):
      return exports.removeFromWatchlist(event);
    default:
      return createResponse(404, { error: 'Not found' });
  }
}; 