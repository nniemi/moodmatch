import React, { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";

interface Props {
  mood: string;
}

export const SpotifyWidget: React.FC<Props> = ({ mood }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    // Get access token from secure API endpoint
    const getToken = async () => {
      try {
        const response = await fetch("/api/spotify-token");
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.access_token);
        } else {
          console.log("No valid access token found");
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    // Search for playlists based on the mood
    const searchPlaylists = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            mood
          )}&type=playlist&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setPlaylists(data.playlists.items || []);
      } catch (error) {
        console.error("Error searching playlists:", error);
      }
    };

    searchPlaylists();
  }, [accessToken, mood]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Spotify Widget</Typography>
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Spotify Widget</Typography>
      {!accessToken ? (
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login with Spotify
        </Button>
      ) : (
        <div>
          <Typography variant="subtitle1">
            Playlists for mood: {mood}
          </Typography>
          <ul>
            {playlists.map((playlist: any) => (
              <li key={playlist.id}>
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {playlist.name}
                </a>{" "}
                by {playlist.owner.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};