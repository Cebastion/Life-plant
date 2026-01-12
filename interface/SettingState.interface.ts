export type ThemeMode = "light" | "dark";

export interface SettingsState {
  theme: ThemeMode;
  notifications: boolean;
}
