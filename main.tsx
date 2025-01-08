import React, { useState, useEffect, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import Cookies from 'js-cookie';
import "./main.css";

// Lazy load the components
const App = lazy(() => import('./App'));
const VideoPlayer = lazy(() => import('./VideoPlayer'));

const Main = () => {
  const [isVideoComplete, setIsVideoComplete] = useState(false);

  useEffect(() => {
    const isFirstUse = !Cookies.get('hasSeenVideo');
    if (isFirstUse) {
      setIsVideoComplete(false); 
      Cookies.set('hasSeenVideo', 'true', { expires: 30 }); 
    } else {
      setIsVideoComplete(true);
    }
  }, []);

  return (
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        {!isVideoComplete ? (
          <VideoPlayer
            onVideosComplete={() => {
              setIsVideoComplete(true);
            }}
          />
        ) : (
          <App 
            videoVisible={isVideoComplete} 
            updateVideoVisibility={setIsVideoComplete} 
          />
        )}
      </Suspense>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
