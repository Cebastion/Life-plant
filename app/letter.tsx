import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAppSelector } from "../hooks/useAppSelector";
import { AppTheme } from "../interface/theme.interface";

const Letter = () => {
  const theme = useAppSelector(state => state.settings.theme);
  const { colors } = useTheme() as AppTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 15,
    },
    heart: {
      fontSize: 20,
      color: 'red',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        Вот и заканчивается этот год. Я невероятно рад, что мы уже 1,5 года вместе - для меня это рекорд в отношениях!
      </Text>
      <Text style={styles.text}>
        Было много моментов, как радостных, так и непростых, но я счастлив, что мы всё ещё вместе несмотря ни на что.
        Я надеюсь, что наши отношения будут только крепче.
      </Text>
      <Text style={styles.text}>
        Я надеюсь, ты будешь пользоваться этим приложением и устройством, хотя бы для идентификации цветов и болезней.
      </Text>
      <Text style={styles.text}>
        Надеюсь следующий год исполнит наши мечты и мы будем вместе.
        Я очень сильно ценю и люблю тебя <Text style={styles.heart}>❤️❤️❤️</Text>
      </Text>
      <Text style={styles.text}>
        Твой, Дима <Text style={styles.heart}>❤️</Text>
      </Text>
    </ScrollView>
  );
};

export default Letter;

