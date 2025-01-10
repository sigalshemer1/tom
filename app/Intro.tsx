import { useEvent,useEventListener  } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, TouchableOpacity, Text ,SafeAreaView} from 'react-native';
import React, { useState, useEffect, useRef,useCallback  } from 'react';
import { useNavigation } from '@react-navigation/native';

const birdsA =require('./videos/birdsA.mp4');
const birdsB =require('./videos/birdsB.mp4');
const birdsC =require('./videos/birdsC.mp4');

export default function Intro (){
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const navigation = useNavigation();
  const [navigateToHome, setNavigateToHome] = useState(false);
  const isNavigating = useRef(false);

  const playerA = useVideoPlayer(birdsA, (player) => {
    player.loop = false; // Use the 'player' argument from the callback
    player.play();
  });
  
  const playerB = useVideoPlayer(birdsB, (player) => {
    player.loop = true;
  });
  
  const playerC = useVideoPlayer(birdsC, (player) => {
    player.loop = false;
  });
  

  const [currentPlayer, setCurrentPlayer] = useState(playerA);
  
  useEventListener(playerA, 'statusChange', ({ status, error }) => {
    if (status==='idle'){
       replacePlayer();
    }
  });

  useEventListener(playerC, 'statusChange', ({ status, error }) => {
    if (status==='idle' && currentPlayer===playerC){
      isNavigating.current = true; 
      setNavigateToHome(true);
    }
  });

  useEffect(() => {
    if (navigateToHome) {
      navigation.navigate('Home'); // Trigger navigation when state changes
    }
  }, [navigateToHome, navigation]);
  

  const replacePlayer = useCallback(async () => {
    currentPlayer.pause();
    switch(currentPlayer){
      case playerA:
        setCurrentPlayer(playerB);
        setIsButtonVisible(true);
        playerB.play();
        break;
      case playerB:
        setCurrentPlayer(playerC);
        playerC.play();
        break;
      case playerC:
        
        break;
    }
  }, [playerA, currentPlayer]);


  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        {currentPlayer === playerA && (
          <VideoView style={styles.video} player={playerA} allowsFullscreen allowsPictureInPicture nativeControls={false} />
        )}
        {currentPlayer === playerB && (
          <VideoView style={styles.video} player={playerB} allowsFullscreen allowsPictureInPicture nativeControls={false} />
        )}
        {currentPlayer === playerC && (
          <VideoView style={styles.video} player={playerC} allowsFullscreen allowsPictureInPicture nativeControls={false}/>
        )}

        {isButtonVisible && (
          <TouchableOpacity style={styles.button} onPress={replacePlayer}>
            <Text style={styles.buttonText}>Shake me</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
  },
  controlsContainer: {
    padding: 0,
  },
  button: {
    position: 'absolute', // Float above other elements
  top: '50%',
  left: '50%',
  transform: [{ translateX: -50 }, { translateY: -50 }],
  zIndex: 110,
  backgroundColor: '#bf4da2',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonView:{
    zIndex: 900,
  }
});
