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
        console.log(`Updated subtitle ${id} field ${field} to ${value}`);
      }
    },
    mergeSubtitles: (
      state,
      action: PayloadAction<{ selectedIds: string[] }>
    ) => {
      const { selectedIds } = action.payload;
      const selectedSubtitles = state.parsedSubtitles.filter((sub) =>
        selectedIds.includes(sub.id)
      );

      if (selectedSubtitles.length < 2) return;

      selectedSubtitles.sort((a, b) => a.startSeconds - b.startSeconds);

      const mergedSubtitle: SubtitleData = {
        id: `${Date.now()}`,
        text: selectedSubtitles.map((s) => s.text).join(" "),
        startTime: selectedSubtitles[0].startTime,
        endTime: selectedSubtitles[selectedSubtitles.length - 1].endTime,
        startSeconds: selectedSubtitles[0].startSeconds,
        endSeconds: selectedSubtitles[selectedSubtitles.length - 1].endSeconds,
      };

      const firstSelectedIndex = state.parsedSubtitles.findIndex(
        (sub) => sub.id === selectedSubtitles[0].id
      );

      state.parsedSubtitles = state.parsedSubtitles.filter(
        (sub) => !selectedIds.includes(sub.id)
      );

      state.parsedSubtitles.splice(firstSelectedIndex, 0, mergedSubtitle);

      console.log(
        `Merged subtitles into new subtitle with id ${mergedSubtitle.id}`
      );
    },

    deleteSubtitle: (state, action) => {
      const { id } = action.payload;

      state.parsedSubtitles = state.parsedSubtitles.filter(
        (sub) => sub.id !== id
      );
      console.log("deleted the state", state.parsedSubtitles);
    },
  },
});

export const { setSubtitle, updateSubtitle, mergeSubtitles, deleteSubtitle } =
  subtitleSlice.actions;
export default subtitleSlice.reducer;
