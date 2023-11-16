import { StyleSheet } from "react-native";
import { Fonts } from "./theme";

export const Global = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 20,
    width: "100%",
  },
  h1: {
    fontFamily: Fonts.semibold,
    fontSize: 36,
  },
  h2: {
    fontFamily: Fonts.medium,
    fontSize: 24,
  },
  h3: {
    fontFamily: Fonts.regular,
    fontSize: 20,
  },
  h4: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  buttonText: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  smallText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
});
