import { useTheme } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../hooks/useAppSelector";
import { AppTheme } from "../interface/theme.interface";

const Manual = () => {
  const { colors } = useTheme() as AppTheme;
  const theme = useAppSelector(state => state.settings.theme);

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 6,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>How to use the app</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>1. Home Screen</Text>
        <Text style={styles.text}>
          The home screen displays the current state of your plant.
          Data is received from the ESP8266 connected to sensors that
          monitor key environmental parameters. This allows you to
          quickly understand whether your plant is in good condition.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>2. Editing Data</Text>
        <Text style={styles.text}>
          In this section, you can change the plant photo and configure
          the parameters that determine when notifications are sent.
          Notifications will work only if they are enabled in the
          settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>3. Plant Identification</Text>
        <Text style={styles.text}>
          You can identify any plant, read information from trusted
          sources, learn about possible plant diseases, and read
          detailed descriptions of them.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>4. Settings</Text>
        <Text style={styles.text}>
          The settings screen plays a key role in communication between
          the app and the ESP8266. Here you can configure which Wi-Fi
          networks the ESP8266 can connect to in order to send data to
          your phone, enable or disable notifications, and change the
          app theme. After changing the network settings, you need to
          restart the ESP8266 using the button located under the device
          enclosure.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Manual;
