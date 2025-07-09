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
    process.env.SPOTIFY_CLIENT_SECRET ? "✅ Set" : "❌ Missing"
  );
  console.log("==========================");
};

// Secure authentication check using server-side API
export const checkAuthStatus = async (): Promise<{
  authenticated: boolean;
  user?: any;
}> => {
  try {
    const response = await fetch("/api/auth-status");
    const data = await response.json();

    console.log("Server auth check result:", data);
    return data;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { authenticated: false };
  }
};

// Utility function to check if user is authenticated (legacy - for backward compatibility)
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
