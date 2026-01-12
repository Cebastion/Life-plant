import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  useGetListWiFiQuery,
  useAddWiFiMutation,
} from "../../store/slice/list_wifi.slice";
import { useKeyboardVisible } from "../../hooks/useKeyboardVisible";

const { width, height } = Dimensions.get("window");
const passivePosotion = height / 2 - 480;
const activePosotion = height / 2 - 580;

const ModalAddWiFi = ({ visible = true, onClose }: any) => {
  const theme = useAppSelector(state => state.settings.theme);
  const { data } = useGetListWiFiQuery();
  const [addWiFi] = useAddWiFiMutation();

  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");

  const isKeyboardOpen = useKeyboardVisible();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const keyboardTranslateY = useRef(
    new Animated.Value(passivePosotion)
  ).current;

  const Add = async () => {
    if (!data || !Name || Name === "") return;

    await addWiFi({
      WiFis: [...data.WiFis, { ssid: Name, password: Password }],
    }).unwrap();

    setName("");
    setPassword("");
    onClose();
  };

  // появление модалки
  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  // реакция на клавиатуру
  useEffect(() => {
    Animated.timing(keyboardTranslateY, {
      toValue: isKeyboardOpen ? activePosotion : passivePosotion,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isKeyboardOpen]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity, height: height }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
              width: Math.min(width - 32, 420),
              transform: [
                { translateY: keyboardTranslateY },
                { scale },
                { translateY },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, theme === "dark" && styles.textDark]}>
              Add Wi-Fi
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Image
                source={
                  theme === "dark"
                    ? require("../../assets/close-x-white.png")
                    : require("../../assets/close-x-black.png")
                }
                style={styles.close}
              />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <TextInput
            placeholder="WiFi name"
            placeholderTextColor="#999"
            style={[styles.input, theme === "dark" && styles.inputDark]}
            value={Name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="WiFi password"
            placeholderTextColor="#999"
            secureTextEntry
            style={[styles.input, theme === "dark" && styles.inputDark]}
            value={Password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={Add}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({ overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 100, }, modal: { borderRadius: 16, padding: 16, elevation: 10, }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, }, title: { fontSize: 18, fontWeight: "600", fontFamily: "Nunito", color: "#000", }, textDark: { color: "#fff", }, close: { width: 22, height: 22, }, input: { height: 44, borderRadius: 10, paddingHorizontal: 12, backgroundColor: "#F2F2F2", marginBottom: 12, color: "#000", }, inputDark: { backgroundColor: "#2A2A2A", color: "#fff", }, button: { marginTop: 8, height: 44, borderRadius: 12, backgroundColor: "#4F46E5", justifyContent: "center", alignItems: "center", }, buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, fontFamily: "Nunito", }, });

export default ModalAddWiFi;

