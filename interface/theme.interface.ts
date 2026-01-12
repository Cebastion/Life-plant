import { Theme } from "@react-navigation/native";

export interface AppTheme extends Theme {
  colors: Theme['colors'] & {
    backgroundCard: string;
    label: string;
    Borderinput: string;
    backgroundInput: string;
    TextInput: string;
    ButtonCamera: string;
    page: string;
  };
}
