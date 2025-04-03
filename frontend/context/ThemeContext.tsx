import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

type ThemeType = 'light' | 'dark';

export const colors = {
  light: {
    primary: '#FF6F61',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#333333',
    secondaryText: '#666666',
    border: '#EEEEEE',
    notification: '#FF6F61',
    inputBackground: '#FFFFFF',
    modalBackground: 'rgba(0, 0, 0, 0.5)',
    modalContent: '#FFFFFF',
    selectedBackground: '#FFF8F0',
    disabledButton: '#CCCCCC',
    placeholder: '#999999',
  },
  dark: {
    primary: '#FF6F61',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F0F0F0',
    secondaryText: '#AAAAAA',
    border: '#333333',
    notification: '#FF6F61',
    inputBackground: '#2A2A2A',
    modalBackground: 'rgba(0, 0, 0, 0.7)',
    modalContent: '#1E1E1E',
    selectedBackground: '#2D221F',
    disabledButton: '#555555',
    placeholder: '#777777',
  }
};

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof colors.light | typeof colors.dark;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: colors.light,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    // Load saved theme when app starts
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  useEffect(() => {
    // Update status bar style when theme changes
    StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    if (theme === 'dark') {
      StatusBar.setBackgroundColor('#121212');
    } else {
      StatusBar.setBackgroundColor('#FFFFFF');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        colors: theme === 'light' ? colors.light : colors.dark,
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 