import React from 'react';
import RootLayout from "./_layout";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/homescreen';

const Stack = createStackNavigator();

export default function App() {
    return <RootLayout />;
}
