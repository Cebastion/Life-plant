import { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { IForm } from "../../interface/from.interface";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../../interface/theme.interface";
import * as FileSystem from "expo-file-system/legacy";
import { FileService } from "../../services/file.service";
import * as ImagePicker from "expo-image-picker";
import { useGetConfigQuery, useSaveConfigMutation } from "../../store/slice/plantConfig.slice";
import { PlantConfigDTO } from "../../interface/PlantConfigDTO.interface";
import { IConfigPlant } from "../../interface/configPlant.interface";

const Add = () => {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme() as AppTheme;
  const { data } = useGetConfigQuery()
  const [saveConfig] = useSaveConfigMutation()
  const [dataPlant, setDataPlant] = useState<IConfigPlant>();

  const [uri, setUri] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<IForm>>({});

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const dataJson = await FileService.getFiles();

      setDataPlant(dataJson);
    };

    fetchData();
  }, []);

  /* ---------- ADAPTIVE LAYOUT ---------- */

  const GAP = 12;
  const PADDING = 16;
  const isTablet = width >= 768;

  const inputWidth = isTablet
    ? (width - PADDING * 2 - GAP * 3) / 3
    : (width - PADDING * 2 - GAP) / 2;

  const imageHeight = Math.min(360, height * 0.4);

  /* ---------- IMAGE PICKER ---------- */

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access the media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access the camera is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
  };

  /* ---------- SAVE ---------- */

  const SaveImagePlant = async () => {
    if (!uri) return;

    const dir = FileSystem.documentDirectory + "data/";
    const dirInfo = await FileSystem.getInfoAsync(dir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    const dest = dir + "plant.json";
    const imageUri = await FileService.SavePhoto(uri);

    await FileSystem.writeAsStringAsync(
      dest,
      JSON.stringify({
        image: imageUri,
      })
    );

    console.log("Saved to:", dest);
  }

  const validateRange = (
    min: number,
    max: number,
    label: string
  ): boolean => {
    if (max < min) {
      Alert.alert(
        "Validation error",
        `${label}: max value cannot be less than min value`
      );
      return false;
    }
    return true;
  };

  const savePlant = async () => {
    if (
      form.min_temp == null ||
      form.max_temp == null ||
      form.min_humidity == null ||
      form.max_humidity == null ||
      form.min_soil_moisture == null ||
      form.max_soil_moisture == null
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (
      !validateRange(form.min_temp, form.max_temp, "Temperature") ||
      !validateRange(form.min_humidity, form.max_humidity, "Humidity") ||
      !validateRange(form.min_soil_moisture, form.max_soil_moisture, "Soil moisture")
    ) {
      return;
    }

    await saveConfig(form as PlantConfigDTO).unwrap();

    Alert.alert("Success", "Plant saved successfully");
  };

  /* ---------- HELPERS ---------- */

  const toStr = (v?: string | number) => (v == null ? "" : String(v));

  /* ---------- RENDER ---------- */

  const renderPicture = (uri: string) => (
    <View style={styles.preview}>
      <Image source={{ uri }} style={[styles.previewImage, { height: imageHeight }]} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button title="Pick another image" onPress={pickImage} />
        <Button title="Take a photo" onPress={takePhoto} />
      </View>
    </View>
  );

  const renderInputs = (
    label: string,
    maxKey: keyof IForm,
    minKey: keyof IForm
  ) => (
    <View>
      <Text style={[styles.label, { color: colors.label }]}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            {
              width: inputWidth,
              backgroundColor: colors.backgroundInput,
              borderColor: colors.Borderinput,
              color: colors.TextInput,
            },
          ]}
          placeholder={`max ${label.toLowerCase()}`}
          placeholderTextColor={colors.TextInput}
          inputMode="decimal"
          value={toStr(form[maxKey])}
          onChangeText={(v) => setForm({ ...form, [maxKey]: v === "" ? 0 : Number(v) })}
        />
        <TextInput
          style={[
            styles.input,
            {
              width: inputWidth,
              backgroundColor: colors.backgroundInput,
              borderColor: colors.Borderinput,
              color: colors.TextInput,
            },
          ]}
          placeholder={`min ${label.toLowerCase()}`}
          placeholderTextColor={colors.TextInput}
          inputMode="decimal"
          value={toStr(form[minKey])}
          onChangeText={(v) => setForm({ ...form, [minKey]: v === "" ? 0 : Number(v) })}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: PADDING, paddingBottom: 60 }}
        style={{ backgroundColor: colors.page }}
        keyboardShouldPersistTaps="handled"
      >
        {uri ? renderPicture(uri) : (
          renderPicture(dataPlant?.image as string)
        )}
        <Button title="Save image" onPress={SaveImagePlant} />

        <View style={styles.form}>
          {renderInputs("Soil moisture", "max_soil_moisture", "min_soil_moisture")}
          {renderInputs("Humidity", "max_humidity", "min_humidity")}
          {renderInputs("Temperature", "max_temp", "min_temp")}
        </View>

        <Button title="Save data" onPress={savePlant} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Add;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  preview: {
    alignItems: "center",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 10,
  },
  form: {
    gap: 14,
    marginBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: "Nunito",
  },
});

