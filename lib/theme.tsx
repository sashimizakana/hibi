import { MD3DarkTheme, useTheme } from "react-native-paper";
const theme = {
  ...MD3DarkTheme,
  // Specify a custom property
  custom: "property",
  // Specify a custom property in nested object
  colors: {
    ...MD3DarkTheme.colors,
    text: "#fff",
    secondary: "#888",
    border: "#555",
  },
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>(theme);
