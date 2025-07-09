import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Button } from "@mui/material";
import { fetchSpotifyRecentTracks } from "../features/spotifySlice";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";
import { AppDispatch } from "../app/store";

export const SpotifyWidget: React.FC = () => {
  const { recentTracks } = useSelector((state: any) => state.spotify);
  const dispatch = useDispatch<AppDispatch>();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    if (accessToken) {
      dispatch(fetchSpotifyRecentTracks(accessToken));
    }
  }, [dispatch, accessToken]);

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
          <Typography variant="subtitle1">Recent Tracks:</Typography>
          <ul>
            {recentTracks.map((track: any, index: number) => (
              <li key={index}>
                {track.track.name} by{" "}
                {track.track.artists
                  .map((artist: any) => artist.name)
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};
