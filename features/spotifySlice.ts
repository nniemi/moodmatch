import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface SpotifyState {
  recentTracks: any[];
}

const initialState: SpotifyState = {
  recentTracks: [],
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setRecentTracks: (state, action: PayloadAction<any[]>) => {
      state.recentTracks = action.payload;
    },
  },
});

export const fetchSpotifyRecentTracks =
  (accessToken: string) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(setRecentTracks(response.data.items));
    } catch (error) {
      console.error("Error fetching Spotify recent tracks:", error);
    }
  };

export const { setRecentTracks } = spotifySlice.actions;
export default spotifySlice.reducer;
