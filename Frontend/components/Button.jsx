import React, { useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Button as RNEButton } from "@rneui/themed";
import { Fonts } from "../theme";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../colors";

const CustomButton = ({
  title,
  onPress,
  disabled,
  type,
  size,
  raised,
  icon,
  iconPosition,
  iconColor,
  buttonStyle,
  titleStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      await onPress();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <RNEButton
      title={isLoading ? null : title}
      onPress={handlePress}
      disabled={disabled || isLoading}
      buttonStyle={[
        styles.button,
        disabled && styles.disabledButton,
        buttonStyle,
      ]}
      titleStyle={[styles.buttonText, titleStyle]}
      containerStyle={styles.buttonContainer}
      type={type}
      size={size}
      raised={raised}
      icon={<Icon name={icon} size={20} color={iconColor} />}
      iconPosition={iconPosition}
    />
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: colors.disabled,
    color: colors.disabledText,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    paddingHorizontal: 16,
  },
});
