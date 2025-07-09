import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie;

  const debug = {
    hasCookies: !!cookies,
    allCookies: cookies || "none",
    spotifyToken: cookies?.includes("spotify_access_token=")
      ? "present"
      : "missing",
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(debug);
}
