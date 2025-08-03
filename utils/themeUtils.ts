import { createTheme } from "@mui/material/styles";

// Default mood-to-color mapping (fallback)
const defaultColors: Record<string, { primary: string; secondary: string }> = {
  happy: { primary: "#FFD700", secondary: "#FFECB3" }, // Yellow
  sad: { primary: "#2196F3", secondary: "#BBDEFB" }, // Blue
  energetic: { primary: "#FF5722", secondary: "#FFCCBC" }, // Orange
  calm: { primary: "#4CAF50", secondary: "#C8E6C9" }, // Green
  default: { primary: "#9E9E9E", secondary: "#E0E0E0" }, // Gray
};

// Function to fetch mood colors from API
export const fetchMoodColors = async (
  mood: string
): Promise<{ primary: string; secondary: string }> => {
  try {
    const response = await fetch('/api/theme-utils', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mood }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const colors = await response.json();
    
    // Validate the response structure
    if (colors.primary && colors.secondary) {
      return colors;
    } else {
      console.warn("Invalid response from API. Falling back to default colors.");
      return defaultColors[mood] || defaultColors.default;
    }
  } catch (error) {
    console.error("Error fetching mood colors from API:", error);
    return defaultColors[mood] || defaultColors.default; // Fallback to default colors
  }
};

// Function to create a theme based on the mood
export const getThemeForMood = async (mood: string): Promise<any> => {
  const colors = await fetchMoodColors(mood);

  return createTheme({
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.secondary,
      },
    },
  });
};
