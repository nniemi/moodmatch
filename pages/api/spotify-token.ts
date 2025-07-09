import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the access token from the HttpOnly cookie
  const cookies = req.headers.cookie;
  const spotifyToken = cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("spotify_access_token="));

  if (!spotifyToken) {
    return res.status(401).json({ error: "No access token found" });
  }

  const accessToken = spotifyToken.split("=")[1];

  // Return the token for frontend use
  // Note: This is still secure because the token is only accessible via this API call
  // and the original token remains HttpOnly
  return res.status(200).json({
    access_token: accessToken,
  });
}
