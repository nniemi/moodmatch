import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Callback endpoint hit:", req.method, req.url);
  console.log("Query parameters:", req.query);

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    console.log("No code provided, returning 400");
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    console.log("Token received successfully");

    res.setHeader(
      "Set-Cookie",
      `spotify_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${expires_in}`
    );

    console.log("Redirecting to main page...");
    res.redirect("/");
  } catch (error: any) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to exchange authorization code for token" });
  }
}
