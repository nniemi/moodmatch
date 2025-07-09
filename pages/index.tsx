// moodmatch-dashboard/frontend/pages/index.tsx
import { useState, useEffect } from "react";
import { SpotifyWidget } from "../components/SpotifyWidget";
import { Recommendations } from "../components/Recommendations";
import { MoodChatbot } from "../components/MoodChatbot";
import LandingPage from "../components/LandingPage";
import { checkAuthStatus, logout } from "../auth/spotifyAuth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Home() {
  const [mood, setMood] = useState<string>("");
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
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Typography variant="body2" color="text.secondary">
              Welcome, {user.display_name}!
            </Typography>
          )}
          <Button variant="outlined" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Box>
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
