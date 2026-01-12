import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { useAppSelector } from "../../hooks/useAppSelector";
import { FC } from "react";

const { height, width } = Dimensions.get("window");

const AddCircle: FC<{ Function?: () => void }> = ({ Function }) => {
  const theme = useAppSelector(state => state.settings.theme);

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.circle} onPress={Function}>
      <Image style={styles.image} source={theme === "dark" ? require("../../assets/plus-large-black.png") : require("../../assets/plus-large-white.png")} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  circle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
    position: "absolute",
    top: height - 150,
    right: 15,
    backgroundColor: "#4F46E5",
    zIndex: 50,
  },
  image: {
    width: 24,
    height: 24,
  },
})

export default AddCircle
