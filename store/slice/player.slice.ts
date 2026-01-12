import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMusic } from "../../interface/music.interface";

interface PlayerState {
  current: IMusic | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  current: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playMusic(state, action: PayloadAction<IMusic>) {
      state.current = action.payload;
      state.isPlaying = true;
    },
    pauseMusic(state) {
      state.isPlaying = false;
    },
    stopMusic(state) {
      state.current = null;
      state.isPlaying = false;
    },
  },
});

export const { playMusic, pauseMusic, stopMusic } = playerSlice.actions;
export default playerSlice.reducer;

