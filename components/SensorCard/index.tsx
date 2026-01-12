import { useTheme } from "@react-navigation/native";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { AppTheme } from "../../interface/theme.interface";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 2; // 2 колонки + отступы

const SensorCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme() as AppTheme;

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
      {children}
      <Text style={[styles.cardTitle, { color: colors.text }]} > {title}</Text>
    </View >
  )
};

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: 600
  },
})

export default SensorCard;
