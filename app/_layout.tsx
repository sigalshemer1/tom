import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet,View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import IntroScreen from './intro/Intro';
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
    <Stack.Screen
      name="TipsMain"
      component={TipsScreen}
      options={{
        title: 'Tips',
        headerStyle: styles.header, // Apply the header style from your layout
        headerTintColor: '#6F5D6A', // Header text color
        headerTitleStyle: styles.headerTitle, // Title styling
      }}
    />
    <Stack.Screen
      name="Meditation"
      component={MeditationScreen}
      options={{
        title: 'Meditation',
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Sport"
      component={SportScreen}
      options={{
        title: 'Sport and Dance',
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Healing"
      component={HealingScreen}
      options={{
        title: 'Healing',
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
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
      <SQLiteProvider databaseName="tom.db" onInit={migrateDbIfNeeded}>
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
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="home-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Your Graph"
                component={GraphScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="bar-chart-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Tips"
                component={TipsNavigator}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="bulb-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="MyTools"
                component={MyToolsScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="hammer-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Intro"
                component={IntroScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="heart-half-outline" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
        )}
      </SQLiteProvider>
    </ThemeProvider>

  );
};

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS mytools (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL);
    `);
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS thoughts (id INTEGER PRIMARY KEY NOT NULL, level INTEGER NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP);
      `);
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F3EFF0',
    borderTopWidth: 0,
  },
  header: {
    backgroundColor: '#F3EFF0',
    elevation: 0,
  },
  top:{
    backgroundColor: '#F3EFF0',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default Layout;

