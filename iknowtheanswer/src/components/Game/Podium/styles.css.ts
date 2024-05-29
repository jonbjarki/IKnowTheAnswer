import { style } from "@vanilla-extract/css";
import { themeVars } from "../../../themes/theme.css";

export const podium = style({
  backgroundColor: themeVars.colors.grey,
  padding: "4em",
  borderRadius: "10px",
  marginTop: "1em",
});