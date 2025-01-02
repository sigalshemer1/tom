import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import HomeScreen from './Home';
import GraphScreen from './Graph';
import MyToolsScreen from './MyTools';
import TipsScreen from './tips/Tips';
import MeditationScreen from './tips/Meditation';
import SportScreen from './tips/Sport';
import HealingScreen from './tips/Healing'
import 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// SplashScreen.preventAutoHideAsync();

const TipsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="TipsMain" component={TipsScreen} options={{ title: 'Tips' }} />
    <Stack.Screen name="Meditation" component={MeditationScreen} options={{ title: 'Meditation' }} />
    <Stack.Screen name="Sport" component={SportScreen} options={{ title: 'Sport and Dance' }} />
    <Stack.Screen name="Healing" component={HealingScreen} options={{ title: 'Healing' }} />
  </Stack.Navigator>
);


const Layout = () => {

  const colorScheme = useColorScheme();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFirstTime = async () => {
      const isFirstVisit = await AsyncStorage.getItem('isFirstTime');
      if (isFirstVisit === null) {
        await AsyncStorage.setItem('isFirstTime', 'false');
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
      }
    };

    checkFirstTime();
  }, []);

  useEffect(() => {
    if (isReady && isFirstTime) {
      //router.push('/intro/Intro'); // Navigate to the first intro screen
      console.log('First time');
      setIsFirstTime(false);
    }
  }, [isFirstTime, isReady]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isFirstTime && (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#bf4da2',
            tabBarInactiveTintColor: '#6F5D6A',
            headerStyle: styles.header,
            headerTintColor: '#6F5D6A',
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Graph" component={GraphScreen} />
          <Tab.Screen name="Tips" component={TipsNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="MyTools" component={MyToolsScreen} />
        </Tab.Navigator>
      )}
    </ThemeProvider>

  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F3EFF0',
    borderTopWidth: 0,
  },
  header: {
    backgroundColor: '#F3EFF0',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default Layout;

