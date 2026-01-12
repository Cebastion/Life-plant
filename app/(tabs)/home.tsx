import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CircleBlock from "../../components/CircleBlock";
import SensorCard from "../../components/SensorCard";
import { IPlant } from "../../interface/plant.interface";
import { PlantService } from "../../services/plant.service";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../../interface/theme.interface";
import { FileService } from "../../services/file.service";
import { IConfigPlant } from "../../interface/configPlant.interface";
import { loadSettings } from "../../store/slice/setting.slice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import Loading from "../../components/Loading";
import * as Network from 'expo-network';
import { useAppSelector } from "../../hooks/useAppSelector";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';


export default function PlantScreen() {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme() as AppTheme;

  const theme = useAppSelector((state) => state.settings.theme);

  const [plant, setPlant] = useState<IPlant>();
  const [dataPlant, setDataPlant] = useState<IConfigPlant>();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const dispatch = useAppDispatch();


  const PADDING = 16;

  const imageHeight = Math.min(280, height * 0.3);

  const CheckNetWork = async () => {
    const { isConnected } = await Network.getNetworkStateAsync();

    setIsConnected(isConnected || false);
  }

  useEffect(() => {
    CheckNetWork();
  }, []);

  useEffect(() => {
    dispatch(loadSettings());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await PlantService.GetPlantData();

      setPlant(data);
      setLoading(false);
    };

    const GetData = async () => {
      const dataJson = await FileService.getFiles();
      setDataPlant(dataJson);
    }

    GetData();
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <View style={[styles.centerNoWifi, { backgroundColor: colors.background }]}>
        <Image
          source={
            theme === "dark"
              ? require("../../assets/no-wifi-white.png")
              : require("../../assets/no-wifi-black.png")
          }
          style={styles.noWifiImage}
          resizeMode="contain"
        />

        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} style={styles.messageContainer}>
          <Text style={[styles.noWifiText, { color: colors.text }]}>
            No internet connection
          </Text>

          <TouchableOpacity onPress={CheckNetWork} style={[styles.retryButton, { borderColor: colors.text }]}>
            <Text style={[styles.retryText, { color: colors.text }]}>Try again</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: PADDING }}
    >
      <Image
        source={
          dataPlant?.image
            ? { uri: dataPlant.image }
            : require("../../assets/monstera.jpg")
        }
        style={[
          styles.image,
          { height: imageHeight }
        ]}
      />

      <View style={styles.grid}>
        <SensorCard title="Temperature">
          <CircleBlock value={Number(plant?.temperature) || 0} suffix="°C" />
        </SensorCard>

        <SensorCard title="Humidity">
          <CircleBlock value={Number(plant?.humidity) || 0} suffix="%" />
        </SensorCard>

        <SensorCard title="Soil">
          <CircleBlock value={Number(plant?.soil) || 0} suffix="%" />
        </SensorCard>

        <SensorCard title="Light">
          <CircleBlock value={Number(plant?.light) || 0} suffix="%" />
        </SensorCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    borderRadius: 16,
    marginBottom: 16
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16
  },
  centerNoWifi: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noWifiImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  messageContainer: {
    alignItems: 'center',
  },
  noWifiText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 24,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

