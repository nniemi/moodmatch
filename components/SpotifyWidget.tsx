import React from "react";
import { Paper, Typography } from "@mui/material";

export const SpotifyWidget: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography>Recent tracks will appear here...</Typography>
    </Paper>
  );
};
