import { createSlice } from "@reduxjs/toolkit";

export interface Subtitle {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  text: string;
}

const initialState = { file: "", parsedSubtitles: [] as Subtitle[] };

const subtitleSlice = createSlice({
  name: "subtitle",
  initialState,
  reducers: {
    setSubtitle: (state, action) => {

    },
    updateSubtitle: (state, action) => {

    }
  },
});

export const { setSubtitle, updateSubtitle } = subtitleSlice.actions;
export default subtitleSlice.reducer;
