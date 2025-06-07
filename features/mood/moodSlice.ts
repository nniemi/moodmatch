import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MoodState {
  currentMood: string;
}

const initialState: MoodState = {
  currentMood: "",
};

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    setMood: (state, action: PayloadAction<string>) => {
      state.currentMood = action.payload;
    },
  },
});

export const { setMood } = moodSlice.actions;
export default moodSlice.reducer;
