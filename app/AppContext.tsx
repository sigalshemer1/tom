import React, { createContext, useContext, useState } from 'react';


const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [resetIntroFlag, setResetIntroFlag] = useState(false); 
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  

  return (
    <AppContext.Provider value={{ isFirstTime, setIsFirstTime, resetIntroFlag, setResetIntroFlag,isButtonVisible, setIsButtonVisible  }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
