import React, { useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";

interface Props {
  setMood: (mood: string) => void;
}

export const MoodChatbot: React.FC<Props> = ({ setMood }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMood(data.mood);
      setResponse(`Detected mood: ${data.mood}`);
    } catch (err) {
      setResponse("Failed to detect mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Describe your current mood or situation:
      </Typography>
      <TextField
        fullWidth
        label="Type something..."
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Mood"}
      </Button>
      {response && (
        <Typography sx={{ mt: 2 }} color="primary">
          {response}
        </Typography>
      )}
    </Paper>
  );
};
