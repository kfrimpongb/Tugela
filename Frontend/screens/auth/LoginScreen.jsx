import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";

import fav from "../../assets/images/fav.png";
import { Fonts } from "../../theme";
import colors from "../../colors";

const LoginScreen = () => {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    fontFamily: Fonts.regular,
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
  },
  fav: {
    width: 50,
    height: 50,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  form: {
    fontFamily: Fonts.medium,
  },
});
