import { Video, AVPlaybackStatus } from 'expo-av';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ScrollView,StatusBar } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DeviceMotion } from 'expo-sensors';

const birdsA = require('./videos/birds.mp4');
const birdsC = require('./videos/birdsC.mp4');

export default function Intro() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);
  const navigation = useNavigation();
  const [navigateToHome, setNavigateToHome] = useState(false);
  const isNavigating = useRef(false);

  const playerA = useRef<Video>(null);
  const playerC = useRef<Video>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'playerA' | 'playerC'>('playerA');

  useEffect(() => {
    if (navigateToHome) {
      setIsButtonVisible(false);
      navigation.navigate('Home');
      setTimeout(() => {
        navigation.replace('SettingsMain');
      }, 0);
    }
  }, [navigateToHome, navigation]);

  const replacePlayer = useCallback(() => {
    if (currentPlayer === 'playerA' && playerA.current) {
      setIsButtonVisible(false); // Hide the button immediately
      playerA.current.pauseAsync();
      setCurrentPlayer('playerC');
      if (playerC.current) {
        playerC.current.playAsync();
      }
    }else if (currentPlayer === 'playerC') {
      setBtnClicked(true);
    }
  }, [currentPlayer]);

  const handlePlaybackStatusUpdateA = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.isPlaying && !isButtonVisible && currentPlayer === 'playerA') {
      // Show the button after 4 seconds
      setTimeout(() => {
        if (currentPlayer === 'playerA') {
          setIsButtonVisible(true);
        }
      }, 4000);
    }
    if (status.didJustFinish && currentPlayer === 'playerA') {
      replacePlayer();
    }
  };


  const handlePlaybackStatusUpdateC = (status: AVPlaybackStatus) => {
    if (status.didJustFinish && currentPlayer === 'playerC') {
      isNavigating.current = true;
      setNavigateToHome(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <StatusBar barStyle="dark-content" hidden /> 
        <View style={styles.root}>
          <View style={styles.contentContainer}>
            {currentPlayer === 'playerA' && (
              <Video
                ref={playerA}
                source={birdsA}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdateA}
              />
            )}
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
    backgroundColor: '#000', // Ensure background is set
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
    height:100,
    width:100,
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
  safeAreaView: {
    flex: 1,
    overflow: 'visible',
  },
});
