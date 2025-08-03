// moodmatch-dashboard/frontend/pages/index.tsx
import { useState, useEffect } from "react";
import { Recommendations } from "../components/Recommendations";
import { MoodChatbot } from "../components/MoodChatbot";
import LandingPage from "../components/LandingPage";
import { checkAuthStatus, logout } from "../auth/spotifyAuth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { 
  Fade, 
  Slide, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  MusicNote,
  Logout,
  Person,
  Dashboard
} from "@mui/icons-material";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status using secure server-side API
    const checkAuth = async () => {
      try {
        const authResult = await checkAuthStatus();
        console.log("Main page - Authentication result:", authResult);
        setAuthenticated(authResult.authenticated);
        setUser(authResult.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure cookies are set after redirect
    const timer = setTimeout(checkAuth, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Typography variant="h4" mb={2}>
              Loading your personalized experience...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Setting up your mood music dashboard
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (!authenticated) {
    return <LandingPage />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Enhanced App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" flex={1}>
            <MusicNote sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold">
              MoodMatch Dashboard
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar 
                  src={user.images?.[0]?.url} 
                  sx={{ width: 32, height: 32 }}
                >
                  <Person />
                </Avatar>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {user.display_name}
                </Typography>
              </Box>
            )}
            <Chip 
              label="Connected" 
              size="small" 
              color="success" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Tooltip title="Logout">
              <IconButton 
                onClick={logout}
                sx={{ color: 'white' }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Dashboard sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight="bold">
                Welcome back!
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Tell us how you're feeling and discover the perfect music for your mood
            </Typography>
          </Box>
        </Fade>

        {/* Enhanced Mood Chatbot */}
        <Slide direction="up" in={true} timeout={1200}>
          <Box>
            <MoodChatbot />
          </Box>
        </Slide>

        {/* Additional Features Section */}
        <Slide direction="up" in={true} timeout={1400}>
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Discover More
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3 
            }}>
              <Card 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    🎵 Music Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Get personalized music suggestions based on your current mood and listening history.
                  </Typography>
                  <Chip label="Coming Soon" color="primary" size="small" />
                </CardContent>
              </Card>

              <Card 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    📊 Mood Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Track your mood patterns and discover your music listening habits over time.
                  </Typography>
                  <Chip label="Coming Soon" color="secondary" size="small" />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Slide>
      </Container>
    </Box>
  );
}
