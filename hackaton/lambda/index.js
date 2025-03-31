const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  
  try {
    await client.connect();
    
    // Parse the body if it exists
    const parsedBody = body ? JSON.parse(body) : null;
    
    // Route handling
    if (path.startsWith('/users')) {
      if (httpMethod === 'POST' && path === '/users') {
        return await handleUserRegister(parsedBody);
      } else if (httpMethod === 'POST' && path === '/users/login') {
        return await handleUserLogin(parsedBody);
      } else if (httpMethod === 'GET' && path.match(/^\/users\/\d+$/)) {
        const userId = path.split('/')[2];
        return await handleGetUser(userId);
      }
    } else if (path.startsWith('/movies')) {
      if (httpMethod === 'GET' && path === '/movies') {
        return await handleGetMovies();
      } else if (httpMethod === 'GET' && path.match(/^\/movies\/\d+$/)) {
        const movieId = path.split('/')[2];
        return await handleGetMovie(movieId);
      }
    } else if (path.startsWith('/users/') && path.includes('/watchlist')) {
      const userId = path.split('/')[2];
      if (httpMethod === 'GET') {
        return await handleGetWatchlist(userId);
      } else if (httpMethod === 'POST') {
        return await handleAddToWatchlist(userId, parsedBody);
      }
    } else if (path.startsWith('/users/') && path.includes('/preferences')) {
      const userId = path.split('/')[2];
      if (httpMethod === 'GET') {
        return await handleGetPreferences(userId);
      } else if (httpMethod === 'POST') {
        return await handleAddPreference(userId, parsedBody);
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  } finally {
    await client.end();
  }
};

// Handler functions
async function handleUserRegister(body) {
  const { email, password } = body;
  const result = await client.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, password]
  );
  return {
    statusCode: 201,
    body: JSON.stringify(result.rows[0])
  };
}

async function handleUserLogin(body) {
  const { email, password } = body;
  const result = await client.query(
    'SELECT id, email FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  
  if (result.rows.length === 0) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows[0])
  };
}

async function handleGetUser(userId) {
  const result = await client.query(
    'SELECT id, email FROM users WHERE id = $1',
    [userId]
  );
  
  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows[0])
  };
}

async function handleGetMovies() {
  const result = await client.query('SELECT * FROM movies');
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows)
  };
}

async function handleGetMovie(movieId) {
  const result = await client.query(
    'SELECT * FROM movies WHERE id = $1',
    [movieId]
  );
  
  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Movie not found' })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows[0])
  };
}

async function handleGetWatchlist(userId) {
  const result = await client.query(
    'SELECT * FROM watchlist WHERE user_id = $1',
    [userId]
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows)
  };
}

async function handleAddToWatchlist(userId, body) {
  const { movie_id, title, image, description, rating } = body;
  const result = await client.query(
    'INSERT INTO watchlist (user_id, movie_id, title, image, description, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, movie_id, title, image, description, rating]
  );
  return {
    statusCode: 201,
    body: JSON.stringify(result.rows[0])
  };
}

async function handleGetPreferences(userId) {
  const result = await client.query(
    'SELECT * FROM user_preferences WHERE user_id = $1',
    [userId]
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows)
  };
}

async function handleAddPreference(userId, body) {
  const { movie_id, title, image, description, rating } = body;
  const result = await client.query(
    'INSERT INTO user_preferences (user_id, movie_id, title, image, description, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, movie_id, title, image, description, rating]
  );
  return {
    statusCode: 201,
    body: JSON.stringify(result.rows[0])
  };
} 