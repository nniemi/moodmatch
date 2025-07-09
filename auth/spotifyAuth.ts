export const getSpotifyAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  let redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scopes = [
    "user-read-recently-played",
    "user-read-email",
    "user-read-private",
  ];

  if (!clientId) {
    throw new Error(
      "SPOTIFY_CLIENT_ID is not defined in the environment variables."
    );
  }

  if (!redirectUri) {
    throw new Error(
      "SPOTIFY_REDIRECT_URI is not defined in the environment variables."
    );
  }

  // Debug logging - remove this after fixing the issue
  console.log("Debug - Raw Redirect URI from env:", redirectUri);
  console.log("Debug - Redirect URI length:", redirectUri.length);
  console.log("Debug - Redirect URI first character:", redirectUri.charAt(0));
  console.log("Debug - Client ID:", clientId);

  // Temporary fix: if redirect URI starts with @, use the correct one
  if (redirectUri.startsWith("@")) {
    console.warn("Debug - Redirect URI starts with @, using fallback");
    redirectUri = "https://moodmatch-liard.vercel.app/api/callback";
  }

  // Validate redirect URI format
  if (
    !redirectUri.startsWith("http://") &&
    !redirectUri.startsWith("https://")
  ) {
    throw new Error(
      `Invalid redirect URI format: ${redirectUri}. Must start with http:// or https://`
    );
  }

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  // Debug logging - remove this after fixing the issue
  console.log("Debug - Full Auth URL:", authUrl);

  return authUrl;
};

// Debug function to check your environment variables
export const debugSpotifyConfig = () => {
  console.log("=== Spotify Config Debug ===");
  console.log(
    "Client ID:",
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "Redirect URI:",
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "❌ Missing"
  );
  console.log(
    "Client Secret:",
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ? "✅ Set" : "❌ Missing"
  );
  console.log("==========================");
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") return false; // Server-side check

  const cookies = document.cookie.split(";");
  const spotifyToken = cookies.find((cookie) =>
    cookie.trim().startsWith("spotify_access_token=")
  );

  return !!spotifyToken;
};

// Utility function to get access token from cookies
export const getAccessToken = (): string | null => {
  if (typeof document === "undefined") return null; // Server-side check

  const cookies = document.cookie.split(";");
  const spotifyToken = cookies.find((cookie) =>
    cookie.trim().startsWith("spotify_access_token=")
  );

  if (spotifyToken) {
    return spotifyToken.split("=")[1];
  }

  return null;
};

// Utility function to logout (clear the access token cookie)
export const logout = (): void => {
  if (typeof document === "undefined") return; // Server-side check

  // Clear the cookie by setting it to expire in the past
  document.cookie =
    "spotify_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

  // Reload the page to show the landing page
  window.location.reload();
};
