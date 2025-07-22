import { createTheme } from "@mui/material/styles";
import OpenAI from "openai";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default mood-to-color mapping (fallback)
const defaultColors: Record<string, { primary: string; secondary: string }> = {
  happy: { primary: "#FFD700", secondary: "#FFECB3" }, // Yellow
  sad: { primary: "#2196F3", secondary: "#BBDEFB" }, // Blue
  energetic: { primary: "#FF5722", secondary: "#FFCCBC" }, // Orange
  calm: { primary: "#4CAF50", secondary: "#C8E6C9" }, // Green
  default: { primary: "#9E9E9E", secondary: "#E0E0E0" }, // Gray
};

// Function to fetch mood colors from OpenAI
export const fetchMoodColors = async (
  mood: string
): Promise<{ primary: string; secondary: string }> => {
  const prompt = `The user described their mood as "${mood}".\n\nProvide a primary and secondary hex color scheme that best matches this mood. Respond with a JSON object containing "primary" and "secondary" keys.`;

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct", // Use the same model as in mood.ts
      prompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    // Parse the response from OpenAI
    const colors = JSON.parse(completion.choices[0].text?.trim() || "{}");

    // Validate the response structure
    if (colors.primary && colors.secondary) {
      return colors; // { primary: "#hexcode", secondary: "#hexcode" }
    } else {
      console.warn(
        "Invalid response from OpenAI. Falling back to default colors."
      );
      return defaultColors[mood] || defaultColors.default;
    }
  } catch (error) {
    console.error("Error fetching mood colors from OpenAI:", error);
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
