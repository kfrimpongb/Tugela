import { StyleSheet } from "react-native";
import { Fonts } from "./theme";
import colors from "./colors";

export const Global = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 20,
    width: "100%",
  },
  h1: {
    fontSize: 32,
    color: colors.title,
  },
  h2: {
    fontSize: 24,
    color: colors.title,
  },
  h3: {
    fontSize: 20,
    color: colors.title,
  },
  h4: {
    fontSize: 18,
    color: colors.text,
  },
  h5: {
    fontSize: 16,
    color: colors.text,
  },
  h6: {
    fontSize: 18,
    color: colors.title,
  },
  buttonText: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },
});
