import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../../interface/theme.interface";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useRouter } from "expo-router";

const Identification = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const heightBlock = height / 3.5 - 20;
  const widthBlock = width - 40;

  const { colors } = useTheme() as AppTheme;
  const theme = useAppSelector((state) => state.settings.theme);

  const textColor = theme === "dark" ? "#fff" : "#000";

  return (
    <View style={styles.container}>
      {/* Species */}
      <TouchableOpacity
        onPress={() => router.push("/species")}
        style={[
          styles.block,
          {
            width: widthBlock,
            height: heightBlock,
            backgroundColor: colors.backgroundCard,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.center}>
          <Image
            source={theme === "dark" ? require("../../assets/plant-white.png") : require("../../assets/plant-black.png")}
            style={styles.image}
          />
          <Text style={[styles.title, { color: textColor }]}>
            Identification species
          </Text>
        </View>
      </TouchableOpacity>

      {/* Diseases */}
      <TouchableOpacity
        onPress={() => router.push("/diseases")}
        style={[
          styles.block,
          {
            width: widthBlock,
            height: heightBlock,
            backgroundColor: colors.backgroundCard,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.center}>
          <Image
            source={theme === "dark" ? require("../../assets/virus-white.png") : require("../../assets/virus-black.png")}
            style={styles.image}
          />
          <Text style={[styles.title, { color: textColor }]}>
            Identification diseases
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  block: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    elevation: 3, // Android тень
  },
  center: {
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Identification;

