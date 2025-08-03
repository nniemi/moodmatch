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
  Box,
  Card,
  CardContent,
  Skeleton,
  Fade,
  Slide,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  LinearProgress,
  Badge
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
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
  const [themeLoading, setThemeLoading] = useState<boolean>(true);

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
      setThemeLoading(true);
      const newTheme = await getThemeForMood(mood);
      setTheme(newTheme);
      setThemeLoading(false);
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

  const handlePlayClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleShareClick = (url: string) => {
    navigator.share?.({ url }) || navigator.clipboard.writeText(url);
  };

  if (themeLoading) {
    return (
      <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={200} height={32} />
          </Box>
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h6" color="white" fontWeight="bold">
            🎵 Spotify Recommendations
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            Finding the perfect music for your mood...
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width={280} height={120} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Fade in={true} timeout={800}>
        <Card elevation={8} sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <MusicNoteIcon sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    🎵 Music for your mood
                  </Typography>
                  <Chip 
                    label={mood} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      mt: 1
                    }} 
                  />
                </Box>
              </Box>
              {!accessToken && (
                <Button 
                  variant="contained" 
                  onClick={handleLogin}
                  sx={{ 
                    backgroundColor: '#1DB954',
                    '&:hover': { backgroundColor: '#1ed760' }
                  }}
                >
                  Connect Spotify
                </Button>
              )}
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {!accessToken ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" mb={2}>
                  Connect your Spotify account to get personalized recommendations
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleLogin}
                  startIcon={<MusicNoteIcon />}
                >
                  Login with Spotify
                </Button>
              </Box>
            ) : (
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                 {/* Playlists Section */}
                 <Box sx={{ flex: 1 }}>
                   <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                     📚 Playlists for {mood}
                   </Typography>
                   <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                     {playlists.length > 0 ? (
                       playlists.map((playlist: any) => (
                         <Fade key={playlist.id} in={true} timeout={300}>
                           <Card 
                             elevation={2} 
                             sx={{ 
                               mb: 2, 
                               cursor: 'pointer',
                               transition: 'all 0.3s ease',
                               '&:hover': {
                                 transform: 'translateY(-2px)',
                                 boxShadow: 4,
                               }
                             }}
                             onClick={() => handlePlayClick(playlist.external_urls.spotify)}
                           >
                             <CardContent sx={{ p: 2 }}>
                               <Box display="flex" alignItems="center" justifyContent="space-between">
                                 <Box display="flex" alignItems="center" flex={1}>
                                   <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                     <MusicNoteIcon />
                                   </Avatar>
                                   <Box flex={1}>
                                     <Typography variant="subtitle1" fontWeight="medium" noWrap>
                                       {playlist.name}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                       by {playlist.owner.display_name}
                                     </Typography>
                                   </Box>
                                 </Box>
                                 <Box display="flex" gap={1}>
                                   <Tooltip title="Play">
                                     <IconButton size="small" color="primary">
                                       <PlayArrowIcon />
                                     </IconButton>
                                   </Tooltip>
                                   <Tooltip title="Share">
                                     <IconButton 
                                       size="small" 
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         handleShareClick(playlist.external_urls.spotify);
                                       }}
                                     >
                                       <ShareIcon />
                                     </IconButton>
                                   </Tooltip>
                                 </Box>
                               </Box>
                             </CardContent>
                           </Card>
                         </Fade>
                       ))
                     ) : (
                       <Typography color="text.secondary" textAlign="center" py={2}>
                         No playlists found for this mood
                       </Typography>
                     )}
                   </Box>
                 </Box>

                 {/* Songs Section */}
                 <Box sx={{ flex: 1 }}>
                   <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                     🎵 Songs for {mood}
                   </Typography>
                   <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                     {songs.length > 0 ? (
                       songs.map((song: any) => (
                         <Fade key={song.id} in={true} timeout={300}>
                           <Card 
                             elevation={2} 
                             sx={{ 
                               mb: 2, 
                               cursor: 'pointer',
                               transition: 'all 0.3s ease',
                               '&:hover': {
                                 transform: 'translateY(-2px)',
                                 boxShadow: 4,
                               }
                             }}
                             onClick={() => handlePlayClick(song.external_urls.spotify)}
                           >
                             <CardContent sx={{ p: 2 }}>
                               <Box display="flex" alignItems="center" justifyContent="space-between">
                                 <Box display="flex" alignItems="center" flex={1}>
                                   <Avatar 
                                     src={song.album.images[0]?.url} 
                                     sx={{ mr: 2 }}
                                   >
                                     <AlbumIcon />
                                   </Avatar>
                                   <Box flex={1}>
                                     <Typography variant="subtitle1" fontWeight="medium" noWrap>
                                       {song.name}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                       {song.artists.map((artist: any) => artist.name).join(", ")}
                                     </Typography>
                                   </Box>
                                 </Box>
                                 <Box display="flex" gap={1}>
                                   <Tooltip title="Play">
                                     <IconButton size="small" color="primary">
                                       <PlayArrowIcon />
                                     </IconButton>
                                   </Tooltip>
                                   <Tooltip title="Share">
                                     <IconButton 
                                       size="small" 
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         handleShareClick(song.external_urls.spotify);
                                       }}
                                     >
                                       <ShareIcon />
                                     </IconButton>
                                   </Tooltip>
                                 </Box>
                               </Box>
                             </CardContent>
                           </Card>
                         </Fade>
                       ))
                     ) : (
                       <Typography color="text.secondary" textAlign="center" py={2}>
                         No songs found for this mood
                       </Typography>
                     )}
                   </Box>
                 </Box>
               </Box>
            )}
          </CardContent>
        </Card>
      </Fade>
    </ThemeProvider>
  );
};
