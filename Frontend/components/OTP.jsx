import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../colors"; // Assuming you have a colors file

const OtpInputs = ({ onOtpComplete }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (otp.every((val) => val.length === 1)) {
      onOtpComplete && onOtpComplete(otp.join(""));
    }
  }, [otp, onOtpComplete]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          style={styles.otpBox}
          value={otp[index]}
          onChangeText={(text) => handleOtpChange(text, index)}
          keyboardType="numeric"
          maxLength={1}
        />
      ))}
    </View>
  );
};

export default OtpInputs;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colors.borderColor,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 6,
  },
});
