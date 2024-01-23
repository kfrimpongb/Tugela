import { StyleSheet } from "react-native";
import React from "react";
import OTPVerification from "./OTPVerification";
import { useNavigation } from "@react-navigation/native";

const SignupOTP = () => {
  const navigation = useNavigation();

  const navigateToOnboarding = () => {
    navigation.navigate("Onboarding");
  };
  return (
    <OTPVerification
      onVerificationSuccess={navigateToOnboarding}
      onVerificationFailure={(error) =>
        console.log("Verification error:", error)
      }
      onSendOtpSuccess={(data) => console.log("OTP sent:", data)}
      onSendOtpFailure={(error) => console.log("Failed to send OTP:", error)}
    />
  );
};

export default SignupOTP;

const styles = StyleSheet.create({});
