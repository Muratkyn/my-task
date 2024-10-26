import { configureStore } from "@reduxjs/toolkit";
import subtitlReducer from "../store/subtitle/subtitleStore.ts";

const store = configureStore({
  reducer: {
    subtitle: subtitlReducer,
  },
});

export default store;
