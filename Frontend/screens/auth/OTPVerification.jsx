import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import tp from "../../assets/images/OTP.png";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import { Global } from "../../globalStyles";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import OtpInputs from "../../components/OTP";

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");

  const handleOtpComplete = (otpValue) => {
    setOtp(otpValue);
  };

  const navigateToOtp = () => {
    navigation.navigate("OTP");
  };
  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  const isFormValid = () => {
    return email !== "" && password !== "";
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Image source={tp} style={styles.fav} />
          <CustomText style={Global.h2} weight="medium">
            Enter Code
          </CustomText>
        </View>
        <CustomText weight="medium" style={{ fontSize: 14 }}>
          We sent a verification code to your email
        </CustomText>
        <CustomText
          weight="medium"
          style={{
            fontSize: 14,
            textDecorationLine: "underline",
            color: colors.primary,
          }}
        >
          frimpongdarkwakwame@gmail.com
        </CustomText>
      </View>
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.form}>
          <View>
            <OtpInputs onOtpComplete={handleOtpComplete} />
            <View style={styles.account}>
              <View style={styles.signup}>
                <TouchableOpacity onPress={navigateToLogin}>
                  <CustomText style={styles.forgot} weight="semibold">
                    Send code again
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
            <CustomButton
              title={"Confirm"}
              disabled={isFormValid()}
              onPress={navigateToOtp}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    fontFamily: Fonts.regular,
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  header: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fav: {
    width: 60,
    height: 60,
    marginRight: 4,
    marginBottom: 14,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  form: {
    flex: 7,
    fontFamily: Fonts.medium,
    paddingHorizontal: 16,
  },
  title: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: 14,
    width: "100%",
  },
  account: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  signup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    color: colors.primary,
    fontSize: 14,
    paddingLeft: 4,
  },
  forgot: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  divide: {
    width: "40%",
    borderWidth: 0.3,
    color: colors.borderColor,
  },
  button: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 16,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    color: colors.primary,
  },
});
