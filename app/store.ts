import { configureStore } from "@reduxjs/toolkit";
import moodReducer from "../features/mood/moodSlice";
import spotifyReducer from "../features/spotifySlice";

export const store = configureStore({
  reducer: {
    mood: moodReducer,
    spotify: spotifyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
