import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Image
                    source={{ uri: 'https://your-image-url.com/hero-image.jpg' }}
                    style={styles.heroImage}
                />
                <Text style={styles.heroTitle}>Stream Your Favorite Shows</Text>
                <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Watching</Text>
                </TouchableOpacity>
            </View>

            {/* Featured Content Section */}
            <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>Featured Shows</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContent}>
                    {/* Thumbnail Items */}
                    {['https://your-image-url.com/show1.jpg', 'https://your-image-url.com/show2.jpg', 'https://your-image-url.com/show3.jpg'].map((imageUrl, index) => (
                        <View key={index} style={styles.thumbnailContainer}>
                            <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    heroSection: {
        position: 'relative',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.6,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        zIndex: 1,
    },
    startButton: {
        marginTop: 20,
        backgroundColor: '#e50914',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        zIndex: 1,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuredSection: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    featuredContent: {
        marginTop: 10,
    },
    thumbnailContainer: {
        marginRight: 10,
    },
    thumbnail: {
        width: 150,
        height: 225,
        borderRadius: 10,
    },
});

export default HomeScreen;
