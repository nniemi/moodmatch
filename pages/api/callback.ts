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

  // Debug: Log the values being sent to Spotify
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  console.log("Debug - Redirect URI being sent:", redirectUri);
  console.log("Debug - Client ID being sent:", clientId);
  console.log("Debug - Client Secret set:", clientSecret ? "Yes" : "No");

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri!,
        client_id: clientId!,
        client_secret: clientSecret!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;
    console.log("Token received successfully");
    console.log("Token expires in:", expires_in, "seconds");

    // Set the access token as a secure HttpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `spotify_access_token=${access_token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${expires_in}`,
      ...(isProduction ? ["Secure"] : []),
    ].join("; ");

    console.log("Setting secure HttpOnly cookie with options:", cookieOptions);
    res.setHeader("Set-Cookie", cookieOptions);

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
