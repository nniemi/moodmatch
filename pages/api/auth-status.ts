import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the access token from the HttpOnly cookie
  const cookies = req.headers.cookie;
  const spotifyToken = cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("spotify_access_token="));

  if (!spotifyToken) {
    return res.status(200).json({
      authenticated: false,
      message: "No access token found",
    });
  }

  const accessToken = spotifyToken.split("=")[1];

  try {
    // Validate the token by making a request to Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If we get here, the token is valid
    return res.status(200).json({
      authenticated: true,
      message: "User is authenticated",
      user: {
        id: response.data.id,
        display_name: response.data.display_name,
        email: response.data.email,
      },
    });
  } catch (error: any) {
    // Token is invalid or expired
    console.log("Token validation failed:", error.response?.status);

    // Clear the invalid cookie
    res.setHeader(
      "Set-Cookie",
      "spotify_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    );

    return res.status(200).json({
      authenticated: false,
      message: "Invalid or expired token",
    });
  }
}
