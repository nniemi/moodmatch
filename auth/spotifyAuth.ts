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
      "NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not defined in the environment variables."
    );
  }

  if (!redirectUri) {
    throw new Error(
      "NEXT_PUBLIC_SPOTIFY_REDIRECT_URI is not defined in the environment variables."
    );
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

  return authUrl;
};

// Secure authentication check using server-side API
export const checkAuthStatus = async (): Promise<{
  authenticated: boolean;
  user?: any;
}> => {
  try {
    const response = await fetch("/api/auth-status");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { authenticated: false };
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") return false; // Server-side check

  const cookies = document.cookie.split(";");
  const spotifyToken = cookies.find((cookie) =>
    cookie.trim().startsWith("spotify_access_token=")
  );

  const hasToken = !!spotifyToken;
  console.log("Auth check - Has token:", hasToken);
  if (hasToken) {
    console.log(
      "Auth check - Token found:",
      spotifyToken?.substring(0, 20) + "..."
    );
  }

  return hasToken;
};

// Utility function to get access token from cookies (legacy - for backward compatibility)
export const getAccessToken = (): string | null => {
  if (typeof document === "undefined") return null; // Server-side check

  const cookies = document.cookie.split(";");
  const spotifyToken = cookies.find((cookie) =>
    cookie.trim().startsWith("spotify_access_token=")
  );

  if (spotifyToken) {
    const token = spotifyToken.split("=")[1];
    console.log("Getting access token:", token.substring(0, 20) + "...");
    return token;
  }

  console.log("No access token found in cookies");
  return null;
};

// Secure logout using server-side API
export const logout = async (): Promise<void> => {
  try {
    await fetch("/api/logout", { method: "POST" });
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
  }

  // Reload the page to show the landing page
  window.location.reload();
};
