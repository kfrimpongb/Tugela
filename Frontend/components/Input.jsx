import React, { useState } from "react";
import { Input } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StyleSheet, Platform } from "react-native";
import colors from "../colors";
import { Fonts } from "../theme";
import { Global } from "../globalStyles";

const CustomInput = ({
  type,
  placeholder,
  label,
  leftIcon,
  rightIcon,
  value,
  onChange,
}) => {
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateInput = (text) => {
    let errorMessage = "";

    switch (type) {
      case "Text":
        const isTextValid = text.trim() !== "";
        if (!isTextValid) errorMessage = "Text cannot be empty";
        break;
      case "TextArea":
        const isTextAreaValid = text.trim() !== "";
        if (!isTextAreaValid) errorMessage = "Text area cannot be empty";
        break;
      case "Email":
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(text)) errorMessage = "Invalid email address";
        break;
      case "Password":
        if (text.length < 8) {
          errorMessage = "Password must be at least 8 characters";
        }

        break;
      case "Otp":
        const otpRegex = /^\d{6}$/;
        if (!otpRegex.test(text)) errorMessage = "OTP must be 6 digits ";

        break;
      case "PhoneNumber":
        const phoneRegex = /^\+[1+9]{1}[0-9]{3,14}$/;
        if (!phoneRegex.test(text))
          errorMessage = "Invalid phone number format";

        break;
      case "Currency":
        if (isNaN(parseFloat(text) || !isFinite(text))) {
          errorMessage = "Invalid currency format";
        }

        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChangeText = (text) => {
    const errorMessage = validateInput(text);
    setError(errorMessage);
    onChange(text);
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggles the state
  };
  const getInputProps = () => {
    switch (type) {
      case "Password":
        return {
          secureTextEntry: !isPasswordVisible,
          rightIcon: (
            <Icon
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={18}
              onPress={togglePasswordVisibility}
            />
          ),
        };
      case "Currency":
        return { keyboardType: "numeric" };
      case "Otp":
        return { keyboardType: "numeric" };
      case "PhoneNumber":
        return { keyboardType: "phone-pad" };
      case "TextArea":
        return {
          multiline: true,
          numberOfLines: 5,
        };
      default:
        return {};
    }
  };

  return (
    <Input
      containerStyle={styles.inputContainer}
      inputContainerStyle={[
        styles.input,
        type === "TextArea" && styles.textAreaInput,
      ]}
      value={value}
      onChangeText={handleChangeText}
      errorMessage={error}
      errorStyle={styles.inputError}
      placeholder={placeholder}
      label={label}
      labelStyle={[
        styles.label,
        Platform.OS === "android" ? styles.androidLabel : styles.iosLabel,
      ]}
      inputStyle={styles.inputText}
      leftIcon={<Icon name={leftIcon} size={24} />}
      rightIcon={
        type !== "password" ? <Icon name={rightIcon} size={24} /> : null
      }
      {...getInputProps()}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.2,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 12,
    borderColor: colors.borderColor,
    fontFamily: Fonts.regular,
    width: "100%",
    margin: 0,
  },
  inputContainer: {
    fontFamily: Fonts.regular,
    width: "100%",
    paddingHorizontal: 0,
    marginVertical: 2,
  },
  inputError: {
    color: colors.danger,
    fontFamily: Fonts.medium,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: colors.label,
    paddingBottom: 6,
  },
  androidLabel: {
    fontFamily: "Poppins_400Regular",
  },
  inputText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: colors.title,
    margin: 0,
  },
  textAreaInput: {
    height: 160, // Customize the height for the text area
    textAlignVertical: "top",
    paddingBottom: 90,
  },
});
