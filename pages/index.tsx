// moodmatch-dashboard/frontend/pages/index.tsx
import { useState, useEffect } from "react";
import { SpotifyWidget } from "../components/SpotifyWidget";
import { Recommendations } from "../components/Recommendations";
import { MoodChatbot } from "../components/MoodChatbot";
import LandingPage from "../components/LandingPage";
import { isAuthenticated, logout } from "../auth/spotifyAuth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Home() {
  const [mood, setMood] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!authenticated) {
    return <LandingPage />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">🎧 MoodMatch Dashboard</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={logout}
          sx={{ ml: 2 }}
        >
          Logout
        </Button>
      </Box>

      <MoodChatbot setMood={setMood} />

      <div style={{ marginTop: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Your Recent Spotify Tracks
        </Typography>
        <SpotifyWidget />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Music Suggestions Based on Mood
        </Typography>
        <Recommendations mood={mood} />
      </div>
    </Container>
  );
}
