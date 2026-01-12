import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slice/setting.slice";
import { ListWiFiSlice } from "./slice/list_wifi.slice";
import PlayerSlice from "./slice/player.slice";
import { plantConfigSlice } from "./slice/plantConfig.slice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    player: PlayerSlice,
    [ListWiFiSlice.reducerPath]: ListWiFiSlice.reducer,
    [plantConfigSlice.reducerPath]: plantConfigSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ListWiFiSlice.middleware).concat(plantConfigSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
