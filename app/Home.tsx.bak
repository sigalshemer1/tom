import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video } from 'expo-av';
import { useSQLiteContext } from 'expo-sqlite';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAppContext } from './AppContext';
import { useIsFocused } from '@react-navigation/native';
import logo from '../assets/images/logo.png';

const birdsA = require('../assets/videos/birds.mp4');
const birdsC = require('../assets/videos/birdsC.mp4');

const Home = ({ navigation }) => {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const { 
    resetIntroFlag, 
    setResetIntroFlag,
    isFirstTime, 
    setIsFirstTime,
    isButtonVisible, 
    setIsButtonVisible 
  } = useAppContext();
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'playerA' | 'playerC'>('playerA');
  const [isButtonVisibleEarly, setIsButtonVisibleEarly] = useState(false);
  const playerA = useRef<Video>(null);
  const playerC = useRef<Video>(null);


  

  useEffect(() => {
    // Handle first-time logic and resetIntroFlag
    if (resetIntroFlag) {
      resetIntroLogic();
    } else if (isFirstTime === null) {
      checkFirstTime();
    } else if (isFirstTime) {
      setIsIntroPlaying(true);
      if (playerA.current) {
        playerA.current.playAsync();
      }
    }
  }, [resetIntroFlag, isFirstTime]);


  useEffect(() => {
    const preloadPlayerC = async () => {
      if (playerC.current) {
        await playerC.current.loadAsync(birdsC, {}, false); // Preload playerC in the background
      }
    };
  
    preloadPlayerC(); // Preload PlayerC on component mount
  }, []);
  

  //Hide/show the nav bar at the bottom
  useEffect(() => {
    if (isFocused && isIntroPlaying) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [isFocused, isIntroPlaying, navigation]);

  
  const checkFirstTime = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM isFirst;');
      if (result.length === 0) {
        await db.runAsync('INSERT INTO isFirst (first) VALUES (false)');
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
      }
    } catch (error) {
      console.error('Error checking isFirstTime:', error);
      setIsFirstTime(false);
    }
  };


  const resetIntroLogic = async () => {
    try {
      setCurrentPlayer('playerA');
      await db.runAsync('DELETE FROM isFirst');
      setIsFirstTime(null);
      setIsIntroPlaying(true);
      if (playerA.current) {
        await playerA.current.playAsync();
      }
      setResetIntroFlag(false);
    } catch (error) {
      console.error('Error resetting intro:', error);
    }
  };

  const replacePlayer = useCallback(async () => {
    if (currentPlayer === 'playerA' && playerA.current) {
      setCurrentPlayer('playerC');
      if (playerC.current) {
        await playerC.current.playAsync(); // Start Player C
      }
      setTimeout(async () => {
        if (playerA.current) {
          await playerA.current.unloadAsync(); // Unload Player A after the transition
        }
      }, 100);
    }
  }, [currentPlayer]);


  const handleReadyForDisplayA = useCallback(() => {
    if (playerC.current) {
      // Preload Player C in the background
      playerC.current.loadAsync(birdsC, { shouldPlay: false });
    }
  }, []);

  
  const handlePlaybackStatusUpdateA = (status) => {
    // console.log('Player A Status:', status);
    if (status.isLoaded) {
      const remainingTime = status.durationMillis - status.positionMillis;
  
      if (remainingTime <= 5000 && !isButtonVisibleEarly) {
        setIsButtonVisibleEarly(true); // Show button in the last 4 seconds
      }
  
      if (status.didJustFinish) {
        replacePlayer(); // Switch to playerC when playerA finishes
      }
    }
  };
  
  const handlePlaybackStatusUpdateC = (status) => {
    // console.log('Player C Status:', status);
    if (status.didJustFinish && currentPlayer === 'playerC') {
      setIsIntroPlaying(false); // End the intro
      setIsButtonVisible(false); // Hide button after playerC finishes
      setIsButtonVisibleEarly(false); // Reset early visibility for the next playback
    }
  };
  
  const handleButtonPress = () => {
    setIsButtonVisible(false); 
    setIsButtonVisibleEarly(false);
    replacePlayer(); 
  };

  const insertThought = async (level) => {
    try {
      await db.runAsync('INSERT INTO thoughts (level) VALUES (?)', level);
    } catch (error) {
      console.error('Error in insertThought:', error);
    }
  };

 

  if (isIntroPlaying) {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.root}>
          <View style={styles.contentContainer}>
            {currentPlayer === 'playerA' && (
              <Video
                ref={playerA}
                source={birdsA}
                style={[
                  styles.video,
                  currentPlayer === 'playerA' ? { opacity: 1 } : { opacity: 0 },
                ]}
                resizeMode="cover"
                shouldPlay={currentPlayer === 'playerA'}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdateA}
                onReadyForDisplay={() => {
                  console.log('Player A is ready for display');
                  handleReadyForDisplayA
                }}
              />
            )}
            {currentPlayer === 'playerC' && (
              <Video
                ref={playerC}
                source={birdsC}
                style={[
                  styles.video,
                  currentPlayer === 'playerC' ? { opacity: 1 } : { opacity: 0 },
                ]}
                resizeMode="cover"
                shouldPlay={currentPlayer === 'playerC'}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdateC}
                onReadyForDisplay={() => {
                  console.log('Player C is ready for display');
                }}
              />
            )}
            {(isButtonVisible || isButtonVisibleEarly) && (
              <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <Text style={styles.buttonText}>Shake me</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.topLogo}>
          <Image
            source={logo}
            style={{ width: 200, height: 60, resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.topPannel}>
          <Text style={styles.titleOfLevels}>Choose a level</Text>
          <Text style={styles.normalText}>How intense is your thought right now?</Text>
          <View style={styles.circleButtons}>
          <TouchableOpacity onPress={() => insertThought(1)} >
                  <Image
                    source={require('../assets/images/btn1.png')} 
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => insertThought(2)} >
                  <Image
                    source={require('../assets/images/btn2.png')} 
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => insertThought(3)} >
                  <Image
                    source={require('../assets/images/btn3.png')}  
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => insertThought(4)} >
                  <Image
                    source={require('../assets/images/btn4.png')} 
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => insertThought(5)} >
                  <Image
                    source={require('../assets/images/btn5.png')}  
                    style={styles.icon}
                  />
                </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.normalText}>
              Welcome to <Text style={styles.boldText}>ThinkOmeter</Text>, where you will learn your thought’s patterns.
            </Text>
            <Text style={styles.normalText}>
              Knowing your thought patterns can help prevent negative thought waves by giving you early warning when one
              is coming.
            </Text>
            <Text style={styles.normalText}>
              Gradually, you will be able to recognize when a wave is approaching and learn what helps you stop it.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  topLogo:{
    paddingTop: 2,
    paddingHorizontal: 15,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: '#bf4da2',
    padding: 20,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
  },
  titleOfLevels: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#bf4da2',
    textAlign: 'center',
  },
  circleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#6F5D6A',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#6F5D6A',
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3EFF0',
  },
  textContainer: {
    marginBottom: 20,
  },
  topPannel:{
    paddingHorizontal: 20,
  },
  hiddenTab: {
    display: 'none',
  },
  visibleTab: {
    display: 'flex',
  },
});

export default Home;