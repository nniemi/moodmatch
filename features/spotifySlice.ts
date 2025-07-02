import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface SpotifyState {
  accessToken: string | null;
  recentTracks: any[];
}

const initialState: SpotifyState = {
  accessToken: null,
  recentTracks: [],
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRecentTracks: (state, action: PayloadAction<any[]>) => {
      state.recentTracks = action.payload;
    },
  },
});


export const fetchSpotifyAccessToken = (code: string) => async (dispatch: any) => {
    try {
      const response = await axios.post("https://accounts.spotify.com/api/token", {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI, 
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, 
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET, 
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const accessToken = response.data.access_token;
      dispatch(setAccessToken(accessToken));
    } catch (error) {
      console.error("Error fetching Spotify access token:", error);
    }
  };


export const fetchSpotifyRecentTracks = (accessToken: string) => async (dispatch: any) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    dispatch(setRecentTracks(response.data.items));
  } catch (error) {
    console.error("Error fetching Spotify recent tracks:", error);
  }
};

export const { setAccessToken, setRecentTracks } = spotifySlice.actions;
export default spotifySlice.reducer;