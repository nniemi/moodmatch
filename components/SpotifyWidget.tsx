import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Button } from "@mui/material";
import { fetchSpotifyAccessToken, fetchSpotifyRecentTracks } from "../features/spotifySlice";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";
import { AppDispatch } from "../app/store";

export const SpotifyWidget: React.FC = () => {
  const { accessToken, recentTracks } = useSelector((state: any) => state.spotify);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");


    if (code && !accessToken) {
      dispatch(fetchSpotifyAccessToken(code));
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchSpotifyRecentTracks(accessToken));
    }
  }, [dispatch, accessToken]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

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
              <li key={index}>{track.track.name} by {track.track.artists.map((artist: any) => artist.name).join(", ")}</li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};