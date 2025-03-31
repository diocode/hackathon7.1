import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../services/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

const SwipeRecommendations = ({ onClose }) => {
  const { user, addToWatchlist, addUserPreference } = useAuth();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();

  useEffect(() => {
    loadMovies();

    if (Platform.OS === 'web') {
      const handleKeyPress = (event) => {
        if (event.key === 'ArrowRight') {
          forceSwipe('right');
        } else if (event.key === 'ArrowLeft') {
          forceSwipe('left');
        } else if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [onClose]);

  const loadMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction) => {
    const item = movies[currentIndex];
    position.setValue({ x: 0, y: 0 });

    if (direction === 'right') {
      try {
        await addToWatchlist(item);
        await addUserPreference(item);
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }

    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  if (currentIndex >= movies.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMoreText}>No more recommendations!</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {movies.map((movie, index) => {
        if (index < currentIndex) return null;

        const isFirst = index === currentIndex;
        const dragHandlers = isFirst ? panResponder.panHandlers : {};
        const cardStyle = isFirst ? getCardStyle() : {};

        return (
          <Animated.View
            key={movie.id}
            style={[styles.card, cardStyle]}
            {...dragHandlers}
          >
            <View style={styles.cardContent}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.description}>{movie.description}</Text>
              <Text style={styles.rating}>Rating: {movie.rating}/10</Text>
            </View>
          </Animated.View>
        );
      }).reverse()}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMoreText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SwipeRecommendations; 