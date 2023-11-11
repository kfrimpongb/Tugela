import { View, Text, StyleSheet } from "react-native";
import { Fonts } from "../theme";
import React from "react";

const Button = () => {
  return (
    <View>
      <Text style={styles.buttonText}>Button</Text>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
