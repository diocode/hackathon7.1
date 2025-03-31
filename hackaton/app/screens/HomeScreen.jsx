import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import SwipeRecommendations from './SwipeRecommendations';

const { width } = Dimensions.get('window');
const THUMBNAIL_WIDTH = width * 0.3; // Smaller width (30% of screen)
const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH * 0.56; // 16:9 aspect ratio for thumbnails

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
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

        setMovies(formattedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([
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
        ]);
      }
    };

    fetchMovies();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StreamFlix</Text>
        <TouchableOpacity
          style={styles.recommendButton}
          onPress={() => setShowRecommendations(true)}
        >
          <Text style={styles.recommendButtonText}>Get Recommendations</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Movies</Text>
          <View style={styles.thumbnailGrid}>
            {movies.map((movie) => (
              <TouchableOpacity 
                key={movie.id}
                style={styles.thumbnailContainer}
                onPress={() => {
                  // Handle movie selection
                }}
              >
                <Image
                  source={{ uri: movie.image }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.thumbnailTitle} numberOfLines={2}>
                  {movie.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showRecommendations}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRecommendations(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowRecommendations(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <SwipeRecommendations onClose={() => setShowRecommendations(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
  },
  recommendButton: {
    backgroundColor: '#E50914',
    padding: 10,
    borderRadius: 8,
  },
  recommendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnailContainer: {
    width: THUMBNAIL_WIDTH,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  thumbnail: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: 4,
  },
  thumbnailTitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#141414',
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 