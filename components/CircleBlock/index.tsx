import { useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { AppTheme } from '../../interface/theme.interface';

interface Props {
  value: number;
  suffix?: "%" | "°C";
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CircleBlock: FC<Props> = ({ value, suffix }) => {
  const count = useSharedValue(0);
  const { colors, dark } = useTheme() as AppTheme;

  useEffect(() => {
    count.value = withTiming(value, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${count.value % 1 === 0 ? count.value.toFixed(0) : count.value.toFixed(1)}`,
    };
  });

  return (
    <View style={[styles.circleBlock, { backgroundColor: colors.backgroundCard, shadowOpacity: dark ? 0.5 : 0.25 }]}>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        {...({ animatedProps } as any)}
        style={[styles.value, { color: colors.text }]}
      />
      {suffix && <Text style={[styles.suffix, { color: colors.text }]}>{suffix}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  value: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Nunito"
  },
  suffix: {
    fontSize: 18,
    marginTop: -2,
    fontFamily: "Nunito"
  },
  circleBlock: {
    width: 90,
    height: 90,
    display: "flex",
    flexDirection: "row",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default CircleBlock;

