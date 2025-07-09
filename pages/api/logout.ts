import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Clear the HttpOnly cookie
  res.setHeader(
    "Set-Cookie",
    "spotify_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax"
  );

  return res.status(200).json({ message: "Logged out successfully" });
}
