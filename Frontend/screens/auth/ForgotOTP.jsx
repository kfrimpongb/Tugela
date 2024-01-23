import { StyleSheet } from "react-native";
import React from "react";
import OTPVerification from "./OTPVerification";

const ForgotOTP = () => {
  return (
    <OTPVerification
      onVerificationSuccess={(data) => console.log("Verified:", data)}
      onVerificationFailure={(error) =>
        console.log("Verification error:", error)
      }
      onSendOtpSuccess={(data) => console.log("OTP sent:", data)}
      onSendOtpFailure={(error) => console.log("Failed to send OTP:", error)}
    />
  );
};

export default ForgotOTP;

const styles = StyleSheet.create({});
