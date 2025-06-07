// moodmatch-dashboard/frontend/pages/index.tsx
import { useState } from "react";
import { SpotifyWidget } from "../components/SpotifyWidget";
import { Recommendations } from "../components/Recommendations";
import { MoodChatbot } from "../components/MoodChatbot";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Dashboard() {
  const [mood, setMood] = useState<string>("");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎧 MoodMatch Dashboard
      </Typography>

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
