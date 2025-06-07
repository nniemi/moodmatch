import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const userInput = req.body.message;

  const prompt = `The user described their current mood as:\n"${userInput}"\n\nWhat Spotify music genre best matches this mood? Respond with only the genre (e.g., pop, chill, acoustic, metal, edm, lo-fi, dance, ambient, etc).`;

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 5,
      temperature: 0.7,
    });

    const mood = completion.choices[0].text?.trim() || "Relaxed";

    console.log("OpenAI response:", completion.choices[0].text);
    console.log(`Detected mood: ${mood}`);
    res.status(200).json({ mood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mood: "Relaxed", error: "OpenAI error" });
  }
}
