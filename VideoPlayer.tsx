import React, { useRef, useState } from 'react';
import logo from '../assets/logo.png';
import Shake from 'react-native-shake';

interface VideoPlayerProps {
  onVideosComplete: () => void; // Callback when all videos are finished
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onVideosComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const preloadRefs = useRef<Record<string, HTMLVideoElement | null>>({
    birdsA: null,
    birdsB: null,
    birdsC: null,
  });

  const b1Ref = useRef<HTMLVideoElement | null>(null); // Ref for video b1
  const b2Ref = useRef<HTMLVideoElement | null>(null); // Ref for video b2
  const b3Ref = useRef<HTMLVideoElement | null>(null); // Ref for video b3

  const [currentVideo, setCurrentVideo] = useState('birdsA.mp4'); // Track the current video
  const [isLooping, setIsLooping] = useState(false); // Track if the video should loop
  const [isButtonVisible, setIsButtonVisible] = useState(true); // Track button visibility
  const [buttonPhase, setButtonPhase] = useState(1); // Track button functionality phase
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const handleError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Error loading video', event);
  };

  const handleVideoEnd = async () => {
    if (currentVideo === 'birdsA.mp4') {
      if (b1Ref.current) {
        b1Ref.current.style.display = 'none'; // Hide b1
      }
      if (b2Ref.current) {
        b2Ref.current.style.display = 'block'; // Show b2
        b2Ref.current.play();
      }
      setCurrentVideo('birdsB.mp4');
      setIsLooping(true);
      setIsButtonVisible(true);
      setButtonPhase(2);
    } else if (currentVideo === 'birdsC.mp4') {
      onVideosComplete();
    }
  };

  const handleButtonClick = () => {
    if (buttonPhase === 1) {
      if (b1Ref.current) {
        b1Ref.current.play(); // Play b1 video
      }
      setIsButtonVisible(false);
      setIsLoading(false);
    } else if (buttonPhase === 2) {
      if (b2Ref.current) {
        b2Ref.current.style.display = 'none'; // Hide b2
      }
      if (b3Ref.current) {
        b3Ref.current.style.display = 'block'; // Show b3
        b3Ref.current.play(); // Play b3 video
      }
      setCurrentVideo('birdsC.mp4'); // Explicitly set the current video to birdsC.mp4
      setIsButtonVisible(false);
    }
  };

  // useEffect(() => {
  //   // Add shake event listener
  //   const shakeListener = Shake.addListener(() => {
  //     console.log('Shake detected!');
  //     onVideosComplete(); // Call the function when shake is detected
  //   });

  //   return () => {
  //     // Remove shake event listener
  //     shakeListener.remove();
  //   };
  // }, [onVideosComplete]);

  return (
    <div
      className="videoOfBirds"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      
      {isButtonVisible && (
        <button
          onClick={handleButtonClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            width: '80px',
            height: '80px',
            backgroundColor: '#bf4da2',
            color: 'white',
            border: '1px solid #6f5d6a',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          {buttonPhase === 1 ? 'Play' : 'Shake me'}
        </button>
      )}
      {!isLoading && (
        <div
          className="logoDiv"
          style={{
            position: 'absolute',
            top: '90%',
            zIndex: 20,
            width: '100%',
            height: '9%',
            backgroundImage: `url(${logo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
      )}
      <video
        ref={b1Ref}
        id="b1"
        src="/assets/birdsA.mp4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          margin: 0,
          padding: 0,
          display: 'block',
        }}
        preload="auto"
        onError={handleError}
        onEnded={handleVideoEnd}
      />

      <video
        ref={b2Ref}
        id="b2"
        src="/assets/birdsB.mp4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          margin: 0,
          padding: 0,
          display: 'none',
        }}
        preload="auto"
        onError={handleError}
        onEnded={handleVideoEnd}
      />
      <video
        ref={b3Ref}
        id="b3"
        src="/assets/birdsC.mp4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          margin: 0,
          padding: 0,
          display: 'none',
        }}
        preload="auto"
        onError={handleError}
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default VideoPlayer;
