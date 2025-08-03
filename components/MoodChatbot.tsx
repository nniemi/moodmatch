import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  Fade,
  Slide,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import {
  SentimentSatisfiedAlt,
  MusicNote,
  Psychology,
  AutoAwesome
} from "@mui/icons-material";
import { SpotifyWidget } from "./SpotifyWidget";

const moodSuggestions = [
  "I'm feeling happy and energetic today",
  "I'm a bit sad and need some comfort",
  "I'm stressed and need to relax",
  "I'm feeling nostalgic",
  "I want to dance and have fun",
  "I need something calming and peaceful",
  "I'm feeling romantic",
  "I want something upbeat and motivating"
];

export const MoodChatbot: React.FC = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Fade in={true} timeout={800}>
        <Card elevation={8} sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3,
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Psychology sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                How are you feeling today?
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Describe your mood and we'll find the perfect music for you
            </Typography>

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Tell us about your mood..."
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />

              <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                <Tooltip title="Analyze Mood">
                  <IconButton
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    sx={{ color: 'white' }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      <AutoAwesome />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {showSuggestions && (
              <Slide direction="up" in={showSuggestions} timeout={300}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                    Quick suggestions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {moodSuggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Slide>
            )}

            {response && (
              <Fade in={true} timeout={500}>
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Box display="flex" alignItems="center">
                    <SentimentSatisfiedAlt sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {response}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Spotify Widget with animation */}
      {mood && (
        <Slide direction="up" in={!!mood} timeout={600}>
          <Box>
            <SpotifyWidget mood={mood} />
          </Box>
        </Slide>
      )}
    </Box>
  );
};
