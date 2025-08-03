import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

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
const fetchMoodColors = async (
  mood: string
): Promise<{ primary: string; secondary: string }> => {
  const prompt = `The user described their mood as "${mood}".\n\nProvide a primary and secondary hex color scheme that best matches this mood. Respond with a JSON object containing "primary" and "secondary" keys.`;

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    // Parse the response from OpenAI
    const responseText = completion.choices[0].text?.trim() || "{}";
    let colors;
    
    try {
      colors = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Failed to parse OpenAI response as JSON:", responseText);
      colors = {};
    }

    // Validate the response structure
    if (colors.primary && colors.secondary) {
      return colors;
    } else {
      console.warn("Invalid response from OpenAI. Falling back to default colors.");
      return defaultColors[mood] || defaultColors.default;
    }
  } catch (error) {
    console.error("Error fetching mood colors from OpenAI:", error);
    return defaultColors[mood] || defaultColors.default; // Fallback to default colors
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  try {
    const colors = await fetchMoodColors(mood);
    res.status(200).json(colors);
  } catch (error) {
    console.error("Error in theme-utils API:", error);
    res.status(500).json(defaultColors[mood] || defaultColors.default);
  }
} 