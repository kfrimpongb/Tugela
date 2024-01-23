import { StyleSheet } from "react-native";
import React, { useState } from "react";
import OTPVerification from "./OTPVerification";
import { useNavigation } from "@react-navigation/native";

const ForgotOTP = () => {
  const [close, setClose] = useState(false);
  const closeBottomSheet = () => {
    setClose(false);
  };
  const navigation = useNavigation();
  const navigateToResetPassword = () => {
    navigation.navigate("ResetPassword");
  };
  return (
    <OTPVerification
      onVerificationSuccess={navigateToResetPassword}
      onVerificationFailure={(error) =>
        console.log("Failed to send OTP:", error)
      }
      onSendOtpSuccess={(data) => console.log("OTP sent:", data)}
      onSendOtpFailure={(error) => console.log("Failed to send OTP:", error)}
    />
  );
};

export default ForgotOTP;

const styles = StyleSheet.create({});
