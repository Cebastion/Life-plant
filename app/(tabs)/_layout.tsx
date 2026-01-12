import { Tabs } from "expo-router"
import { Image } from "react-native"
import { useAppSelector } from "../../hooks/useAppSelector"
import { SafeAreaView } from "react-native-safe-area-context"

const TabsLayout = () => {
  const theme = useAppSelector(state => state.settings.theme)
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tabs.Screen name="home" options={{
          animation: "shift", tabBarActiveBackgroundColor: "#21B792", tabBarIcon: ({ size }) => (
            <Image style={{ width: size, height: size }} source={theme === "dark" ? require("../../assets/home-white.png") : require("../../assets/home-black.png")} />
          ),
        }} />
        <Tabs.Screen name="add" options={{
          animation: "shift", tabBarActiveBackgroundColor: "#21B792", tabBarIcon: ({ size }) => (
            <Image style={{ width: size, height: size }} source={theme === "dark" ? require("../../assets/edit-white.png") : require("../../assets/edit-black.png")} />
          )
        }} />
        <Tabs.Screen name="identification" options={{
          animation: "shift", tabBarActiveBackgroundColor: "#21B792", tabBarIcon: ({ size }) => (
            <Image style={{ width: size, height: size }} source={theme === "dark" ? require("../../assets/search-white.png") : require("../../assets/search-black.png")} />
          )
        }} />
        <Tabs.Screen name="setting" options={{
          animation: "shift", tabBarActiveBackgroundColor: "#21B792", tabBarIcon: ({ size }) => (
            <Image style={{ width: size, height: size }} source={theme === "dark" ? require("../../assets/setting-white.png") : require("../../assets/setting-black.png")} />
          )
        }} />
      </Tabs>
    </SafeAreaView>
  )
}

export default TabsLayout
