import { Stack } from "expo-router";
import { Provider } from "react-redux";
import {
  ThemeProvider,
} from "@react-navigation/native";
import { useAppSelector } from "../hooks/useAppSelector";
import { store } from "../store/store";
import { DarkThemeCustom, LightTheme } from "../themes/themes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function RootLayoutNav() {
  const theme = useAppSelector(state => state.settings.theme);

  return (
    <ThemeProvider value={theme === "dark" ? DarkThemeCustom : LightTheme}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="list_wifi" options={{ title: "WiFis" }} />
        <Stack.Screen name="manual" options={{ title: "Manual" }} />
        <Stack.Screen name="letter" options={{ title: "Letter" }} />
        <Stack.Screen name="music" options={{ title: "Music" }} />
        <Stack.Screen name="species" options={{ title: "Species" }} />
        <Stack.Screen name="diseases" options={{ title: "Diseases" }} />
        <Stack.Screen name="web/powo/[id]" options={{ title: "POWO" }} />
        <Stack.Screen name="web/gbif/[id]" options={{ title: "GBIF" }} />
        <Stack.Screen name="web/eppo/[name]" options={{ title: "EPPO" }} />
        <Stack.Screen name="web/bugguid/[name]" options={{ title: "Bug Guid" }} />
        <Stack.Screen name="web/indexfungorum/[name]" options={{ title: "Index Fungorum" }} />
        <Stack.Screen name="web/mycobank/[name]" options={{ title: "Mycobank" }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </Provider>
  );
}

