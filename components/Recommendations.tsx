import React from "react";
import { Paper, Typography } from "@mui/material";

interface Props {
  mood: string;
}

export const Recommendations: React.FC<Props> = ({ mood }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography>
        {mood
          ? `Showing recommendations for: ${mood}`
          : "Select a mood to get started."}
      </Typography>
    </Paper>
  );
};
