import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ScrollView,Alert  } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import logo from '../assets/images/logo.png';

const videoPath = require('./videos/birdsA.mp4');
Alert.alert('Video Path', JSON.stringify(videoPath));
console.log('Video Path:', videoPath);


interface VideoPlayerProps {
  onVideosComplete: () => void;
}

const Intro: React.FC<VideoPlayerProps> = ({ onVideosComplete }) => {
  const [currentVideo, setCurrentVideo] = useState('birdsA.mp4');
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [buttonPhase, setButtonPhase] = useState(1);
  const [videosLoaded, setVideosLoaded] = useState(false);
  
  const [birdsALoaded, setBirdsALoaded] = useState(false);
  const [birdsBLoaded, setBirdsBLoaded] = useState(false);
  const [birdsCLoaded, setBirdsCLoaded] = useState(false);
  
  const videoRefs = {
    birdsA: useRef<VideoRef | null>(null),
    birdsB: useRef<VideoRef | null>(null),
    birdsC: useRef<VideoRef | null>(null),
  };

  const handleVideoEnd = () => {
    if (currentVideo === 'birdsA.mp4') {
      setCurrentVideo('birdsB.mp4');
      setIsButtonVisible(true);
      setButtonPhase(2);
    } else if (currentVideo === 'birdsB.mp4') {
      setCurrentVideo('birdsC.mp4');
      setIsButtonVisible(false);
    } else if (currentVideo === 'birdsC.mp4') {
      onVideosComplete();
    }
  };

  const handleButtonClick = () => {
    if (buttonPhase === 1) {
      setIsButtonVisible(false);
    } else if (buttonPhase === 2) {
      setIsButtonVisible(false);
    }
  };

  // Preloading control
  const handleVideoLoad = (videoName: string) => {
    console.log(`${videoName} loaded`);
    switch (videoName) {
      case 'birdsA.mp4':
        setBirdsALoaded(true);
        break;
      case 'birdsB.mp4':
        setBirdsBLoaded(true);
        break;
      case 'birdsC.mp4':
        setBirdsCLoaded(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (birdsALoaded && birdsBLoaded && birdsCLoaded) {
      setVideosLoaded(true);  // Set all videos loaded after they are loaded
    }
  }, [birdsALoaded, birdsBLoaded, birdsCLoaded]);

  // Handle video error
  const handleVideoError = (error: any) => {
    console.error('Video error:', error);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          {isButtonVisible && (
            <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
              <Text style={styles.buttonText}>
                {buttonPhase === 1 ? 'Play' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Only show videos after they are loaded */}
          {videosLoaded && (
            <>
              {/* Video A */}
              <Video
                ref={videoRefs.birdsA}
                source={require('./videos/birdsA.mp4')}
                style={[
                  styles.video,
                  { display: currentVideo === 'birdsA.mp4' ? 'flex' : 'none' },
                ]}
                resizeMode="cover"
                onEnd={handleVideoEnd}
                onLoad={() => handleVideoLoad('birdsA.mp4')}
                onError={handleVideoError}
                paused={currentVideo !== 'birdsA.mp4'}
                debug={true}
              />

              {/* Video B */}
              <Video
                ref={videoRefs.birdsB}
                source={require('./videos/birdsB.mp4')}
                style={[
                  styles.video,
                  { display: currentVideo === 'birdsB.mp4' ? 'flex' : 'none' },
                ]}
                resizeMode="cover"
                onEnd={handleVideoEnd}
                onLoad={() => handleVideoLoad('birdsB.mp4')}
                onError={handleVideoError}
                paused={currentVideo !== 'birdsB.mp4'}
                debug={true}
              />

              {/* Video C */}
              <Video
                ref={videoRefs.birdsC}
                source={require('./videos/birdsC.mp4')}
                style={[
                  styles.video,
                  { display: currentVideo === 'birdsC.mp4' ? 'flex' : 'none' },
                ]}
                resizeMode="cover"
                onEnd={handleVideoEnd}
                onLoad={() => handleVideoLoad('birdsC.mp4')}
                onError={handleVideoError}
                paused={currentVideo !== 'birdsC.mp4'}
                debug={true}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
    backgroundColor: '#bf4da2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    position: 'absolute',
    bottom: 40,
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  scrollView: {
    padding: 5,
    flexGrow: 1,
    backgroundColor: '#F3EFF0',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
  },
});

export default Intro;
