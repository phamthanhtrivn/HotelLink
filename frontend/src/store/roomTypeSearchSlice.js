import { createSlice } from "@reduxjs/toolkit";
import { formatISO } from "date-fns";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(14, 0, 0, 0)

const dateAfterTomorrow = new Date();
dateAfterTomorrow.setDate(dateAfterTomorrow.getDate() + 2);
dateAfterTomorrow.setHours(12, 0, 0, 0)

const initialState = {
  checkIn: formatISO(tomorrow),
  checkOut: formatISO(dateAfterTomorrow),
  adults: 2,
  children: 0,
  roomTypeName: "",
}

export const roomTypeSearchSlice = createSlice({
  name: "roomTypeSearch",
  initialState,
  reducers: {
    setSearchRoomTypeFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetSearchRoomTypeFilters: () => initialState,
  }
})

export const { setSearchRoomTypeFilters, resetSearchRoomTypeFilters } = roomTypeSearchSlice.actions;

export default roomTypeSearchSlice.reducer;