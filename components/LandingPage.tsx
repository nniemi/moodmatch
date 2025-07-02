import React from "react";
import { useNavigate } from "react-router-dom";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl; // Redirect to Spotify OAuth
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to MoodMatch</h1>
      <p>Log in with Spotify to access your personalized dashboard.</p>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#1DB954",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default LandingPage; 