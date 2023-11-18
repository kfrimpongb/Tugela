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
import check from "../../assets/images/check.png";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import { Global } from "../../globalStyles";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import OtpInputs from "../../components/OTP";
import { BottomSheet } from "@rneui/themed";

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [visible, setVisible] = useState(false);

  const handleOtpComplete = (otpValue) => {
    setOtp(otpValue);
  };

  const showBottomSheet = () => {
    setVisible(true);
    navigation.navigate("OTP");
  };
  const navigateToOnboarding = () => {
    setVisible(false);
    navigation.navigate("Onboarding");
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
                <TouchableOpacity>
                  <CustomText style={styles.forgot} weight="semibold">
                    Send code again
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
            <CustomButton
              title={"Confirm"}
              disabled={isFormValid()}
              onPress={showBottomSheet}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <BottomSheet isVisible={visible} modalProps={{}}>
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            style={styles.closeButton}
          >
            <CustomText
              weight="semibold"
              style={{ fontSize: 16, color: colors.text }}
            >
              Close
            </CustomText>
          </TouchableOpacity>
          <Image source={check} style={styles.check} />
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: 60,
            }}
          >
            <CustomText weight="semibold" style={{ fontSize: 24 }}>
              Verified Successfully
            </CustomText>
            <CustomText
              weight="regular"
              style={{ fontSize: 14, textAlign: "center", paddingTop: 4 }}
            >
              We have successfully verified your email address.
            </CustomText>
          </View>
          <View style={{ width: "100%", paddingBottom: 16 }}>
            <CustomButton
              title={"Continue"}
              disabled={isFormValid()}
              onPress={navigateToOnboarding}
            />
          </View>
        </View>
      </BottomSheet>
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
  check: {
    width: 100,
    height: 100,
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
  bottomSheet: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  closeButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingVertical: 32,
  },
});
