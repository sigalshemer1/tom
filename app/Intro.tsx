import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';
import {useEffect} from 'react';

const birdsA =require('./videos/birdsA.mp4');
const birdsB =require('./videos/birdsB.mp4');
const birdsC =require('./videos/birdsC.mp4');

export default function Intro (){
  const playerA = useVideoPlayer(birdsA, playerA => {
    playerA.loop = false;
    playerA.play();
  });
  
  const playerB = useVideoPlayer(birdsB, playerB => {
    playerB.loop = true;
  });

  const playerC = useVideoPlayer(birdsC, playerC => {
    playerC.loop = false;
    
  });

  // const { isPlaying } = useEvent(playerA, 'playingChange', { isPlaying: playerA.playing });

  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={playerA} allowsFullscreen allowsPictureInPicture />
      <VideoView style={styles.video} player={playerB} allowsFullscreen allowsPictureInPicture />
      <VideoView style={styles.video} player={playerC} allowsFullscreen allowsPictureInPicture />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    padding: 0,
  },
});
