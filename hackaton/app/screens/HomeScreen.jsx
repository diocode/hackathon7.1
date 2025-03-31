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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();
  const { updateUserPreferences, updateWatchlist } = useAuth();

  // Mock data - replace with actual API call
  useEffect(() => {
    setMovies([
      {
        id: 1,
        title: 'Inception',
        image: 'https://example.com/inception.jpg',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        rating: 8.8,
      },
      {
        id: 2,
        title: 'The Matrix',
        image: 'https://example.com/matrix.jpg',
        description: 'A computer programmer discovers a mysterious world.',
        rating: 8.7,
      },
      // Add more movies here
    ]);

    // Add keyboard event listeners for web
    if (Platform.OS === 'web') {
      const handleKeyPress = (event) => {
        if (event.key === 'ArrowRight') {
          forceSwipe('right');
        } else if (event.key === 'ArrowLeft') {
          forceSwipe('left');
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
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

  const onSwipeComplete = (direction) => {
    const item = movies[currentIndex];
    direction === 'right' ? updateWatchlist(item) : updateUserPreferences(item);
    position.setValue({ x: 0, y: 0 });
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
      <View style={styles.noMoreCards}>
        <Text style={styles.noMoreCardsText}>No more recommendations!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <View style={styles.webControls}>
          <TouchableOpacity
            style={[styles.webButton, styles.rejectButton]}
            onPress={() => forceSwipe('left')}
          >
            <Text style={styles.webButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.webButton, styles.acceptButton]}
            onPress={() => forceSwipe('right')}
          >
            <Text style={styles.webButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
        </View>
      )}
      {movies.map((movie, index) => {
        if (index < currentIndex) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={movie.id}
              style={[getCardStyle(), styles.cardStyle]}
              {...panResponder.panHandlers}
            >
              <Image
                source={{ uri: movie.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.rating}>Rating: {movie.rating}/10</Text>
                <Text style={styles.description}>{movie.description}</Text>
              </View>
            </Animated.View>
          );
        }

        return (
          <View
            key={movie.id}
            style={[styles.cardStyle, { top: 10 * (index - currentIndex) }]}
          >
            <Image
              source={{ uri: movie.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.rating}>Rating: {movie.rating}/10</Text>
              <Text style={styles.description}>{movie.description}</Text>
            </View>
          </View>
        );
      }).reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  noMoreCardsText: {
    fontSize: 20,
    color: '#fff',
  },
  webControls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  webButton: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#E50914',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  webButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 