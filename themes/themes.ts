import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { AppTheme } from "../interface/theme.interface";



export const DarkThemeCustom: AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#21B792',          // Ваш акцентный цвет
    background: '#121212',       // Темный фон приложения
    card: '#1E1E1E',             // Цвет таб-бара и заголовков
    backgroundCard: '#252525',   // Для ваших SensorCard (чтобы выделялись на фоне)
    text: '#FFFFFF',             // Основной текст
    border: '#333333',           // Границы разделения
    notification: '#FF453A',
    label: "#FFFFFF",
    Borderinput: "#333333",
    backgroundInput: "#1E1E1E",
    TextInput: "#E0E0E0",
    ButtonCamera: "rgba(255,255,255,0.1)",
    page: "#121212"
  },
};

export const LightTheme: AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    backgroundCard: 'rgb(246, 247, 249)',
    text: '#000000',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 69, 58)',
    label: "#000000",
    Borderinput: "#333333",
    backgroundInput: "#E0E0E0",
    TextInput: "#1E1E1E",
    ButtonCamera: "rgba(255,255,255,0.1)",
    page: "#E0E0E0",
  },
};

