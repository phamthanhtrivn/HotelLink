import { configureStore } from "@reduxjs/toolkit";
import { roomTypeSearchSlice } from "./roomTypeSearchSlice";

export const store = configureStore({
  reducer: {
    roomTypeSearch: roomTypeSearchSlice.reducer
  }
})