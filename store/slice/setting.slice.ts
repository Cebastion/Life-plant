import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState, ThemeMode } from "../../interface/SettingState.interface";
import { FileService } from "../../services/file.service";

export const loadSettings = createAsyncThunk(
  'settings/load',
  async () => {
    try {
      return await FileService.ReadConfig();
    } catch {
      const defaults = initialState;
      await FileService.SaveConfig(defaults);
      return defaults;
    }
  }
);

export const saveSettings = createAsyncThunk<
  void,
  void,
  { state: { settings: SettingsState } }
>('settings/save', async (_, { getState }) => {
  const settings = getState().settings;
  await FileService.SaveConfig(settings);
});

const initialState: SettingsState = {
  theme: "dark",
  notifications: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setNotifications(state, action: PayloadAction<boolean>) {
      state.notifications = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadSettings.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const {
  setTheme,
  toggleTheme,
  setNotifications,
} = settingsSlice.actions;

export default settingsSlice.reducer;
