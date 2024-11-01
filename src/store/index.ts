import { configureStore } from "@reduxjs/toolkit";
import subtitleReducer from "./subtitle/index";

const store = configureStore({
  reducer: {
    subtitle: subtitleReducer,
  },
});

export default store;
