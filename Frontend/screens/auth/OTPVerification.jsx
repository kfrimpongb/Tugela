import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";

import tp from "../../assets/images/OTP.png";
import check from "../../assets/images/check.png";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import { Global } from "../../globalStyles";
import CustomButton from "../../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import OtpInputs from "../../components/OTP";
import { useMutation } from "@apollo/client";
import { OTP_USER } from "../../utils/mutations";
import { SEND_OTP } from "../../utils/mutations";
import CustomBottomSheet from "../../components/ui/BottomSheet";

const OTPVerification = ({
  onVerificationSuccess,
  onVerificationFailure,
  onSendOtpSuccess,
  onSendOtpFailure,
  closeBottomSheet,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState("");
  const [visible, setVisible] = useState(false);
  const [sendOtpVisible, setSendOtpVisible] = useState(false);
  const [bottomSheetMessage, setBottomSheetMessage] = useState("");
  const [bottomSheetMessage2, setBottomSheetMessage2] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSendError, setIsSendError] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const [verifyOtpMutation] = useMutation(OTP_USER);
  const [sendOtpMutation] = useMutation(SEND_OTP);

  useEffect(() => {
    // Perform the action when the bottom sheet is closed
    if (!visible && !sendOtpVisible && nextAction) {
      nextAction();
      setNextAction(null); // Reset the action
    }
  }, [visible, sendOtpVisible, nextAction]);

  // ... existing functions

  // Call this function to close the bottom sheet and set the next action
  const closeBottomSheetAndNavigate = (action) => {
    setNextAction(() => action); // Set the next action
    setVisible(false); // Close the bottom sheet
    setSendOtpVisible(false);
  };

  const returnToOtp = () => {
    setVisible(!visible);
  };

  const showVerificationBottomSheet = (message, isError) => {
    setBottomSheetMessage(message);
    setIsError(isError);
    setVisible(true);
  };
  const showSendOtpBottomSheet = (message, isSendError) => {
    setBottomSheetMessage2(message);
    setIsSendError(isSendError);
    setSendOtpVisible(true);
  };
  const navigateToOnboarding = () => {
    setVisible(false);
    navigation.navigate("Onboarding");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const email = route.params?.email || "";

  const handleOtpComplete = async () => {
    if (!otp) return;
    try {
      const response = await verifyOtpMutation({
        variables: {
          input: {
            email,
            token: otp,
          },
        },
      });

      console.log(response.data.verifyOtp);
      showVerificationBottomSheet("Verification successful", false);
      onVerificationSuccess(response.data);
    } catch (error) {
      showVerificationBottomSheet("Verification Failed", true);
      onVerificationFailure(error);
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await sendOtpMutation({
        variables: {
          input: {
            email,
          },
        },
      });

      console.log(response.data.sendOtp);
      showSendOtpBottomSheet("OTP sent successfully", true);
      onSendOtpSuccess(response.data);
    } catch (error) {
      console.error("OTP verification error:", error.message);
      showSendOtpBottomSheet("OTP send failed", true);
      onSendOtpFailure(error);
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0;
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
          {email}
        </CustomText>
      </View>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View>
            <OtpInputs onOtpComplete={setOtp} />
            <View style={styles.account}>
              <View style={styles.signup}>
                <TouchableOpacity onPress={handleSendOtp}>
                  <CustomText style={styles.forgot} weight="semibold">
                    Send code again
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <CustomButton
            title={"Confirm"}
            disabled={!otp}
            onPress={handleOtpComplete}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <CustomBottomSheet
        visible={visible}
        onClose={returnToOtp}
        isError={isError}
        message={bottomSheetMessage}
        onPress={() => {
          const action = isError
            ? onVerificationFailure
            : onVerificationSuccess;
          closeBottomSheetAndNavigate(action);
        }}
      />
      <CustomBottomSheet
        visible={sendOtpVisible}
        onClose={() => setSendOtpVisible(false)}
        isSendError={isSendError}
        message={bottomSheetMessage2}
        onPress={() => {
          const action = isSendError ? onSendOtpFailure : onSendOtpSuccess;
          closeBottomSheetAndNavigate(action);
        }}
      />
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
    justifyContent: "space-between",
    fontFamily: Fonts.medium,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: 14,
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
