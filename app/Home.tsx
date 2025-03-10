import React, { useState, useEffect, useCallback } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
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
import { InteractionManager } from 'react-native';
import { useAppContext } from './AppContext';
import { useIsFocused } from '@react-navigation/native';
import logo from '../assets/images/logo.png';
import birdsA from '../assets/videos/birds.mp4';
import birdsC from '../assets/videos/birdsC.mp4';

const Home = ({ navigation }) => {
  const playerA = useVideoPlayer(birdsA);
  const playerC = useVideoPlayer(birdsC);

  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const {
    resetIntroFlag,
    setResetIntroFlag,
    isFirstTime,
    setIsFirstTime,
    isButtonVisible,
    setIsButtonVisible,
  } = useAppContext();

  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [isButtonVisibleEarly, setIsButtonVisibleEarly] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(playerA);

  // Initialize players and handle playback on the main thread
  const safeExecutePlayerAction = (player, action) => {
    InteractionManager.runAfterInteractions(() => {
      if (player) {
        action(player);
      }
    });
  };

  useEffect(() => {
    if (resetIntroFlag) {
      resetIntroLogic();
    } else if (isFirstTime === null) {
      checkFirstTime();
    } else if (isFirstTime) {
      setIsIntroPlaying(true);
      safeExecutePlayerAction(playerA, (player) => {
        player.play(); 
      });
    }
  }, [resetIntroFlag, isFirstTime]);


  useEffect(() => {
    if (isFocused && isIntroPlaying) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [isFocused, isIntroPlaying, navigation]);


  useEffect(() => {
    let intervalId;
    if (playerA && currentPlayer === playerA) {
      intervalId = setInterval(() => {
        safeExecutePlayerAction(playerA, (player) => {
          const remainingTime = player.duration - player.currentTime;
          if (remainingTime <= 6 && remainingTime > 0 && !isButtonVisible) {
            setIsButtonVisible(true); // Show button only for playerA
          }
        });
      }, 500); // Check every 500ms
    }
    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval
    };
  }, [playerA, isButtonVisible, currentPlayer]);


  useEffect(() => {
    let intervalId;
    if (playerC && currentPlayer === playerC) {
      intervalId = setInterval(() => {
        safeExecutePlayerAction(playerC, (player) => {
          const remainingTime = player.duration - player.currentTime;
          if (remainingTime <= 1 && isIntroPlaying) {
            setIsIntroPlaying(false); 
          }
        });
      }, 500); 
    }
    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval
    };
  }, [playerC, currentPlayer, isIntroPlaying]);


  
  const resetToDefaults = useCallback(() => {
    setIsIntroPlaying(false);
    setIsButtonVisible(false);
    setCurrentPlayer(playerA); // Default player
    safeExecutePlayerAction(playerA, (player) => player.pause());
    safeExecutePlayerAction(playerC, (player) => player.pause());
  }, [playerA, playerC]);


  useEffect(() => {
    if (!isIntroPlaying) {
      resetToDefaults(); // Reset when `isIntroPlaying` is false
    }
  }, [isIntroPlaying, resetToDefaults]);

  
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
      safeExecutePlayerAction(playerA, (player) => player.pause());
      setCurrentPlayer(playerA);
      safeExecutePlayerAction(playerA, (player) => {
        player.play(); // Start playing playerA when reset
      });
      await db.runAsync('DELETE FROM isFirst');
      setIsFirstTime(null);
      setIsIntroPlaying(true);
      setResetIntroFlag(false);
    } catch (error) {
      console.error('Error resetting intro:', error);
    }
  };

  const replacePlayer = useCallback(async () => {
    if (!playerA || !playerC) {
      console.error('Players are not initialized');
      return;
    }
    const nextPlayer = currentPlayer === playerA ? playerC : playerA;
    safeExecutePlayerAction(currentPlayer, (player) => player.pause());
    setCurrentPlayer(nextPlayer);
  
    if (currentPlayer === playerA) {
      safeExecutePlayerAction(playerC, (player) => player.play());
    } else {
      setIsIntroPlaying(false); // Stop showing the videos
      setIsButtonVisible(false); // Ensure the button is hidden
    }
  }, [currentPlayer, playerA, playerC]);
  


  const handleButtonPress = () => {
    setIsButtonVisible(false); // Hide the button when pressed
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
            <VideoView
              player={currentPlayer}
              style={styles.video}
              nativeControls={false}
              allowsFullscreen
              allowsPictureInPicture
            />
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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