import React, { useEffect, useState } from "react";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Link,
  Divider,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getThemeForMood } from "@/utils/themeUtils";

interface Props {
  mood: string;
}

export const SpotifyWidget: React.FC<Props> = ({ mood }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [theme, setTheme] = useState<any>(null);

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
    const updateTheme = async () => {
      const newTheme = await getThemeForMood(mood);
      setTheme(newTheme);
    };

    updateTheme();
  }, [mood]);

  useEffect(() => {
    const searchPlaylists = async () => {
      if (!accessToken || !mood) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=playlist&q=${mood}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        const filteredPlaylists = data.playlists.items.filter(
          (playlist: any) => playlist !== null
        );
        setPlaylists(filteredPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    const searchSongs = async () => {
      if (!accessToken || !mood) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${mood}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        const filteredSongs = data.tracks.items.filter(
          (song: any) => song !== null
        );
        setSongs(filteredSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    searchPlaylists();
    searchSongs();
  }, [accessToken, mood]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  if (!theme) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Spotify Widget</Typography>
        <Typography>Loading theme...</Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Spotify Widget</Typography>
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Spotify mood widget</Typography>
        {!accessToken ? (
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login with Spotify
          </Button>
        ) : (
          <div>
            <Typography variant="h6" gutterBottom>
              Playlists for mood: {mood}
            </Typography>
            <List>
              {playlists.map((playlist: any) => (
                <ListItem key={playlist.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <MusicNoteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={playlist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                      >
                        {playlist.name}
                      </Link>
                    }
                    secondary={`by ${playlist.owner.display_name}`}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Songs Section */}
            <Typography variant="h6" gutterBottom>
              Songs for mood: {mood}
            </Typography>
            <List>
              {songs.map((song: any) => (
                <ListItem key={song.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={song.album.images[0]?.url}>
                      <AlbumIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={song.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                      >
                        {song.name}
                      </Link>
                    }
                    secondary={`by ${song.artists
                      .map((artist: any) => artist.name)
                      .join(", ")}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
};
