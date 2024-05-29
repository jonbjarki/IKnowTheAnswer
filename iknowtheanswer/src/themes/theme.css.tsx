import { createTheme } from "@vanilla-extract/css";

export const [themeClass, themeVars] = createTheme({
  colors: {
    red: "#D63230",
    white: "#FFFFFF",
    blue: "#2D9CDB",
    grey: "#F2F2F2",
    green: "#27AE60",
  },
});
