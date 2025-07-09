import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      // Frontend variables (public)
      hasClientId: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      hasRedirectUri: !!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "not set",
      // Backend variables (server-only)
      hasServerClientId: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      hasServerClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      hasServerRedirectUri: !!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    },
    message: "API routes are working correctly",
  };

  res.status(200).json(health);
}
