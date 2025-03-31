const API_KEY = '1f54bd990f1c42b8c92a9e4e3ac23cb7';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      description: movie.overview,
      rating: movie.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    // Return some fallback movies in case of error
    return [
      {
        id: 1,
        title: 'Inception',
        image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        rating: 8.8,
      },
      {
        id: 2,
        title: 'The Matrix',
        image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        description: 'A computer programmer discovers a mysterious world.',
        rating: 8.7,
      },
      {
        id: 3,
        title: 'The Dark Knight',
        image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
        rating: 8.9,
      }
    ];
  }
}; 