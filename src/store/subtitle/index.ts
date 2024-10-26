import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  SubtitleData,
  SubtitleState,
  UpdatedSubtitleData,
} from "../../types/index.ts";
import Parser from "srt-parser-2";

const initialState = { file: "", parsedSubtitles: [] as SubtitleData[] };

const subtitleSlice = createSlice({
  name: "subtitle",
  initialState,
  reducers: {
    setSubtitle: (state, action) => {
      const subtitleParser = new Parser();
      const subtitles = subtitleParser
        .fromSrt(action.payload)
        .map((subtitle, index) => ({
          ...subtitle,
          id: index.toString(),
        }));

      state.file = action.payload;
      state.parsedSubtitles = subtitles;
      console.log("Parsed Subtitles:", subtitles);
    },

    updateSubtitle: <T extends keyof SubtitleData>(
      state: SubtitleState,
      action: PayloadAction<UpdatedSubtitleData<T>>
    ) => {
      const { id, field, value } = action.payload;
      const subtitle = state.parsedSubtitles.find(
        (subtitle) => subtitle.id === id.toString()
      );
      if (subtitle) {
        subtitle[field] = value;
      }
    },
  },
});

export const { setSubtitle, updateSubtitle } = subtitleSlice.actions;
export default subtitleSlice.reducer;
