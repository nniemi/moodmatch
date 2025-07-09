import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      hasClientId: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      hasRedirectUri: !!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "not set",
    },
    message: "API routes are working correctly",
  };

  res.status(200).json(health);
}
