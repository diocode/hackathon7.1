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
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 400);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.6, CARD_WIDTH * 1.5);
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
    onMoveShouldSetPanResponder: () => true,
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
      useNativeDriver: true,
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
      useNativeDriver: true,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate }
      ],
    };
  };

  if (currentIndex >= movies.length) {
    return (
      <View style={styles.container}>
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>No more recommendations!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
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
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={() => forceSwipe('left')}
        >
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.addButton]} 
          onPress={() => forceSwipe('right')}
        >
          <Text style={styles.actionButtonText}>Add to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
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
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: Math.min(SCREEN_WIDTH * 0.06, 24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: Math.min(SCREEN_WIDTH * 0.04, 16),
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  rating: {
    fontSize: Math.min(SCREEN_WIDTH * 0.045, 18),
    color: '#ffd700',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#e50914',
  },
  addButton: {
    backgroundColor: '#00c853',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.06, 24),
    color: '#fff',
    textAlign: 'center',
  },
});

export default SwipeRecommendations; 