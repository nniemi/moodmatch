import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getThemeForMood } from './themeUtils';

interface ThemeContextType {
  currentMood: string | null;
  setCurrentMood: (mood: string | null) => void;
  theme: any;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateTheme = async () => {
      if (!currentMood) {
        setTheme(defaultTheme);
        return;
      }

      setIsLoading(true);
      try {
        const newTheme = await getThemeForMood(currentMood);
        setTheme(newTheme);
      } catch (error) {
        console.error('Error updating theme:', error);
        setTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    updateTheme();
  }, [currentMood]);

  const value = {
    currentMood,
    setCurrentMood,
    theme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 