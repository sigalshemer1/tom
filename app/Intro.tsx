import { Video, AVPlaybackStatus } from 'expo-av';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, StatusBar } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const birdsA = require('./videos/birds.mp4');
const birdsC = require('./videos/birdsC.mp4');

export default function Intro() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'playerA' | 'playerC'>('playerA');
  const isNavigating = useRef(false); // Prevent multiple navigation triggers
  const navigation = useNavigation();

  const playerA = useRef<Video>(null);
  const playerC = useRef<Video>(null);

  // Function to switch players and manage video playback
  const replacePlayer = useCallback(async () => {
    if (currentPlayer === 'playerA' && playerA.current) {
      setIsButtonVisible(false); // Hide the button
      await playerA.current.unloadAsync(); // Free memory for playerA
      setCurrentPlayer('playerC'); // Switch to playerC
      if (playerC.current) {
        await playerC.current.playAsync();
      }
    }
  }, [currentPlayer]);

  // Handle navigation when playerC finishes playback
  const handlePlaybackStatusUpdateC = (status: AVPlaybackStatus) => {
    if (status.didJustFinish && currentPlayer === 'playerC' && !isNavigating.current) {
      isNavigating.current = true;
      navigation.navigate('Home');
      // setTimeout(() => {
      //   navigation.replace('SettingsMain');
      // }, 0); // Replace immediately after navigating
    }
  };

  // Show button 4 seconds after playerA starts playing
  useEffect(() => {
    if (currentPlayer === 'playerA') {
      const timeoutId = setTimeout(() => {
        setIsButtonVisible(true);
      }, 4000);
      return () => clearTimeout(timeoutId); // Cleanup timeout
    }
  }, [currentPlayer]);

  // Cleanup function to reset navigation state
  useEffect(() => {
    return () => {
      isNavigating.current = false; // Reset navigation flag on unmount
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <StatusBar barStyle="dark-content" hidden />
      <View style={styles.root}>
        <View style={styles.contentContainer}>
          {/* Player A */}
          {currentPlayer === 'playerA' && (
            <Video
              ref={playerA}
              source={birdsA}
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish && currentPlayer === 'playerA') {
                  replacePlayer(); // Switch to playerC when playerA finishes
                }
              }}
            />
          )}

          {/* Player C */}
          {currentPlayer === 'playerC' && (
            <Video
              ref={playerC}
              source={birdsC}
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdateC}
            />
          )}

          {/* Shake Me Button */}
          {isButtonVisible && currentPlayer === 'playerA' && (
            <TouchableOpacity style={styles.button} onPress={replacePlayer}>
              <Text style={styles.buttonText}>Shake me</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  button: {
    position: 'absolute', // Float above other elements
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 110,
    backgroundColor: '#bf4da2',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    height: 100,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    padding: 0,
    flexGrow: 1,
  },
});
