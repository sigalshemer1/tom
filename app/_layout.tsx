import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet,View ,Image,Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import AppContext from './AppContext';

import logo from '../assets/images/logo.png';

import SettingsScreen from './Settings';
import HomeScreen from './Home';
import GraphScreen from './Graph';
import MyToolsScreen from './MyTools';
import TipsScreen from './tips/Tips';
import MeditationScreen from './tips/Meditation';
import SportScreen from './tips/Sport';
import HealingScreen from './tips/Healing'
import IntroScreen from './Intro'
import 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// SplashScreen.preventAutoHideAsync();
export const HeaderLogo = () => (
  <Image
    source={logo}
    style={{ width: 200, height: 60, resizeMode: 'contain' }}
  />
);
const TipsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TipsMain"
      component={TipsScreen}
      options={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: styles.header, 
        headerTintColor: '#6F5D6A', 
        headerTitleStyle: styles.headerTitle, 
      }}
    />
    <Stack.Screen
      name="Meditation"
      component={MeditationScreen}
      options={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Sport"
      component={SportScreen}
      options={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
    <Stack.Screen
      name="Healing"
      component={HealingScreen}
      options={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: styles.header,
        headerTintColor: '#6F5D6A',
        headerTitleStyle: styles.headerTitle,
      }}
    />
  </Stack.Navigator>
);



const Layout = () => {

  const colorScheme = useColorScheme();
  
  return (
    <AppContext>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SQLiteProvider databaseName="tom.db" onInit={migrateDbIfNeeded}>
              <Tab.Navigator 
                screenOptions={{
                  tabBarStyle: styles.tabBar,
                  tabBarActiveTintColor: '#bf4da2',
                  tabBarInactiveTintColor: '#6F5D6A',
                  headerStyle: styles.header,
                  headerTintColor: '#6F5D6A',
                  headerTitle: () => <HeaderLogo />,
                }}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    headerShown: false,
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
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    headerShown: false,  
                    tabBarIcon: ({ color, size }) => (
                      <Icon name="settings-outline" color={color} size={size} />
                    ),
                  }}
                />
              </Tab.Navigator>
        </SQLiteProvider>
      </ThemeProvider>
    </AppContext>
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
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS isFirst (id INTEGER PRIMARY KEY NOT NULL, first BOLEAN DEFAULT fALSE);
      `);
    currentDbVersion = 1;
  }
  //TO DELETE!!!
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS isFirst (id INTEGER PRIMARY KEY NOT NULL, first BOLEAN DEFAULT fALSE);
    `);
  
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