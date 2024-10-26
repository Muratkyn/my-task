import { configureStore } from "@reduxjs/toolkit";
import subtitlReducer from "./subtitle/index";

const store = configureStore({
  reducer: {
    subtitle: subtitlReducer,
  },
});

export default store;
