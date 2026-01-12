import { FC } from "react"
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../../interface/theme.interface";
import { useDeleteWiFiMutation, useGetListWiFiQuery } from "../../store/slice/list_wifi.slice";

const { width } = Dimensions.get("window");

const WiFiBlock: FC<{ ssid: string; password: string }> = ({ ssid, password }) => {
  const theme = useAppSelector(state => state.settings.theme);
  const { colors } = useTheme() as AppTheme;
  const { data } = useGetListWiFiQuery();
  const [deleteWiFi] = useDeleteWiFiMutation();

  const Delete = (ssid: string) => {
    if (!data) return;

    const filteredData = data.WiFis.filter(
      item => item.ssid !== ssid
    );

    deleteWiFi({ WiFis: filteredData });
  };

  return (
    <View style={styles.row}>
      <Image style={{ width: 24, height: 24 }} source={theme === "dark" ? require("../../assets/wifi-signal-white.png") : require("../../assets/wifi-signal-black.png")} />
      <Text style={{ color: colors.text, fontFamily: "Nunito", fontWeight: '700' }}>{ssid}</Text>
      <TouchableHighlight onPress={() => Delete(ssid)}>
        <Image style={{ width: 20, height: 20 }} source={require("../../assets/delete.png")} />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width,
    paddingHorizontal: 10,
    marginBottom: 16,
  }
})

export default WiFiBlock
