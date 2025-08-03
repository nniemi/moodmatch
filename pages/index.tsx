// moodmatch-dashboard/frontend/pages/index.tsx
import { useState, useEffect } from "react";
import { MoodChatbot } from "../components/MoodChatbot";
import LandingPage from "../components/LandingPage";
import { checkAuthStatus, logout } from "../auth/spotifyAuth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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
import { useTheme } from "../utils/ThemeContext";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const { currentMood, isLoading: themeLoading, theme } = useTheme();

  useEffect(() => {
    // Check authentication status using secure server-side API
    const checkAuth = async () => {
      try {
        const authResult = await checkAuthStatus();
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
    <Box sx={{ 
      minHeight: '100vh', 
      background: currentMood 
        ? `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      transition: 'background 0.5s ease'
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: currentMood 
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          transition: 'background 0.5s ease'
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" flex={1}>
            <MusicNote sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold">
              MoodMatch Dashboard
            </Typography>
            {currentMood && (
              <Chip 
                label={currentMood} 
                size="small" 
                sx={{ 
                  ml: 2,
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white' 
                }} 
              />
            )}
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

        <Slide direction="up" in={true} timeout={1200}>
          <Box>
            <MoodChatbot />
          </Box>
        </Slide>
      </Container>
    </Box>
  );
}
