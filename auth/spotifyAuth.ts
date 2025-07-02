export const getSpotifyAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scopes = [
    "user-read-recently-played",
    "user-read-email",
    "user-read-private",
  ];

    if (!clientId) {
        throw new Error("SPOTIFY_CLIENT_ID is not defined in the environment variables.");
    }

  if (!redirectUri) {
    throw new Error("SPOTIFY_REDIRECT_URI is not defined in the environment variables.");
  }
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  return authUrl;
};