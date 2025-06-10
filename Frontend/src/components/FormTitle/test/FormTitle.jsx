
import './FormTitle.css';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Font Context үүсгэх
const FontContext = createContext();

// Font Provider component
export const FontProvider = ({ children }) => {
  const [fontSettings, setFontSettings] = useState({
    headerFont: 'Roboto',
    textFont: 'Roboto',
    headerSize: '24',
    textSize: '14'
  });

  // CSS variables шинэчлэх
  useEffect(() => {
    const { headerFont, textFont, headerSize,  textSize } = fontSettings;
    
    // Google fonts дуудах
    const fontsToLoad = [headerFont, textFont];
    const uniqueFonts = [...new Set(fontsToLoad)];
    
    const fontUrl = `https://fonts.googleapis.com/css2?${uniqueFonts
      .map(font => `family=${font.replace(' ', '+')}`)
      .join('&')}&display=swap`;
    
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // CSS custom properties тохируулах
    document.documentElement.style.setProperty('--header-font', `"${headerFont}", sans-serif`);
    document.documentElement.style.setProperty('--header-size', `${headerSize}px`);
    document.documentElement.style.setProperty('--text-font', `"${textFont}", sans-serif`);
    document.documentElement.style.setProperty('--text-size', `${textSize}px`);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [fontSettings]);

  const updateFontSettings = (newSettings) => {
    setFontSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <FontContext.Provider value={{ fontSettings, updateFontSettings }}>
      {children}
    </FontContext.Provider>
  );
};

// Hook font context ашиглахад
export const useFontContext = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFontContext must be used within FontProvider');
  }
  return context;
};