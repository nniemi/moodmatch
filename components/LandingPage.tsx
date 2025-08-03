import React from "react";
import { getSpotifyAuthUrl } from "../auth/spotifyAuth";
import {
  Box,
  Typography,
  Button,
  Container,
  Fade,
  Slide,
  Card,
  Chip
} from "@mui/material";
import { 
  MusicNote,
  Psychology,
  AutoAwesome
} from "@mui/icons-material";

const LandingPage: React.FC = () => {
  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 32, color: '#667eea' }} />,
      title: "Mood Analysis",
      description: "AI detects your mood from text"
    },
    {
      icon: <MusicNote sx={{ fontSize: 32, color: '#1DB954' }} />,
      title: "Smart Music",
      description: "Personalized Spotify recommendations"
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 32, color: '#FFD700' }} />,
      title: "Dynamic Themes",
      description: "Visual themes that match your mood"
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Fade in={true} timeout={800}>
        <Box textAlign="center" mb={5}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <MusicNote sx={{ fontSize: 48, color: '#667eea', mr: 2 }} />
            <Typography variant="h3" fontWeight="bold">
              MoodMatch
            </Typography>
          </Box>
          
          <Typography variant="h5" color="text.secondary" mb={3}>
            Your mood, your music
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
            Connect with Spotify and let AI analyze your mood to find the perfect music for how you're feeling.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            startIcon={<MusicNote />}
            sx={{
              backgroundColor: '#1DB954',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#1ed760',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            Connect with Spotify
          </Button>
        </Box>
      </Fade>

      <Slide direction="up" in={true} timeout={1000}>
        <Box>
          <Typography variant="h6" textAlign="center" mb={3} fontWeight="bold">
            How it works
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            {features.map((feature, index) => (
              <Fade key={index} in={true} timeout={1200 + index * 200}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <Box mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Fade>
            ))}
          </Box>
        </Box>
      </Slide>

      <Fade in={true} timeout={1400}>
        <Box textAlign="center">
          <Chip 
            label="Simple • Personal • Free" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.9rem' }}
          />
        </Box>
      </Fade>
    </Container>
  );
};

export default LandingPage;
