import { Switch, Text, TouchableHighlight, View, Image, Platform, Alert } from "react-native";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { toggleTheme, setNotifications, saveSettings } from "../../store/slice/setting.slice";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../../interface/theme.interface";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Link } from "expo-router";
import axios from "axios";
import { useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Setting = () => {
  const dispatch = useAppDispatch();
  const { theme, notifications } = useAppSelector(state => state.settings);
  const { colors } = useTheme() as AppTheme;
  const [loading, setLoading] = useState(false);

  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const getExpoTokenWithRetry = async (
    retries = 5,
    delay = 2000
  ): Promise<string | null> => {
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      return token;
    } catch (e: any) {
      if (
        e?.message?.includes('SERVICE_NOT_AVAILABLE') &&
        retries > 0
      ) {
        console.warn('FCM not ready, retrying...');
        await sleep(delay);
        return getExpoTokenWithRetry(retries - 1, delay * 2);
      }

      console.error('❌ Failed to get push token:', e);
      return null;
    }
  };


  const registerForPush = async (): Promise<string | null> => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission for notifications not granted');
      return null;
    }

    // ⏳ небольшая задержка — КРИТИЧНО
    await sleep(2000);

    const token = await getExpoTokenWithRetry();

    if (token) {
      console.log('✅ Expo push token:', token);
    }

    return token;
  };

  const ToggleNotification = async (value: boolean) => {
    if (loading) return; // защита от спама
    setLoading(true);

    try {
      if (value && !notifications) {
        const token = await registerForPush();

        if (!token) {
          throw new Error('Push token not available');
        }

        await axios.post(
          'https://plant-pied-nine.vercel.app/notification/saveTokenDevice',
          { token }
        );
      }

      await axios.post(
        'https://plant-pied-nine.vercel.app/notification/saveAccessNotificationToken',
        { value }
      );

      // ✅ МЕНЯЕМ СОСТОЯНИЕ ТОЛЬКО ЗДЕСЬ
      dispatch(setNotifications(value));
      dispatch(saveSettings());
    } catch (e) {
      console.error('Toggle notification failed:', e);
      Alert.alert(
        'Error',
        'Failed to update notification settings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
      {/* Основное меню */}
      <View>
        <View style={styles.row}>
          <Text style={[styles.linkText, { color: colors.text }]}>Dark mode</Text>
          <Switch
            value={theme === "dark"}
            onValueChange={() => {
              dispatch(toggleTheme());
              dispatch(saveSettings());
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={[styles.linkText, { color: colors.text }]}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={ToggleNotification}
            disabled={loading}
          />
        </View>

        <Link href="/list_wifi" asChild>
          <TouchableHighlight
            underlayColor={colors.card}
            style={styles.linkRow}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: 24, height: 24, marginRight: 8 }}
                source={theme === "dark"
                  ? require("../../assets/wifi-signal-white.png")
                  : require("../../assets/wifi-signal-black.png")}
              />
              <Text style={[styles.linkText, { color: colors.text }]}>Add Wifis</Text>
            </View>
          </TouchableHighlight>
        </Link>

        <Link href="/music" asChild>
          <TouchableHighlight
            underlayColor={colors.card}
            style={styles.linkRow}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: 24, height: 24, marginRight: 8 }}
                source={theme === "dark"
                  ? require("../../assets/music-white.png")
                  : require("../../assets/music-black.png")}
              />
              <Text style={[styles.linkText, { color: colors.text }]}>Music with help developer</Text>
            </View>
          </TouchableHighlight>
        </Link>

        <Link href="/manual" asChild>
          <TouchableHighlight
            underlayColor={colors.card}
            style={styles.linkRow}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: 24, height: 24, marginRight: 8 }}
                source={theme === "dark"
                  ? require("../../assets/manual-white.png")
                  : require("../../assets/manual-black.png")}
              />
              <Text style={[styles.linkText, { color: colors.text }]}>How use application and devices</Text>
            </View>
          </TouchableHighlight>
        </Link>


        <Link href="/letter" asChild>
          <TouchableHighlight
            underlayColor={colors.card}
            style={styles.linkRow}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: 24, height: 24, marginRight: 8 }}
                source={theme === "dark"
                  ? require("../../assets/history-white.png")
                  : require("../../assets/history-black.png")}
              />
              <Text style={[styles.linkText, { color: colors.text }]}>Letter</Text>
            </View>
          </TouchableHighlight>
        </Link>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: colors.text }}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = {
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  linkRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500" as const,
    fontFamily: "Nunito",
  },
};

export default Setting;

