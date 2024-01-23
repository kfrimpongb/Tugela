import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";

import fav from "../../assets/images/fav.png";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import { Global } from "../../globalStyles";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../../utils/mutations";
import CustomBottomSheet from "../../components/ui/BottomSheet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD);
  const [visible, setVisible] = useState(false);
  const [bottomSheetMessage, setBottomSheetMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const displayBottomSheet = (message, isError) => {
    setBottomSheetMessage(message);
    setIsError(isError);
    setVisible(true);
  };
  const navigateToOtp = () => {
    createUser();
    navigation.navigate("ForgotOTP", { email: email });
  };
  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  const closeBottomSheet = () => {
    setVisible(!visible);
  };
  const navigateToResetPassword = () => {
    navigation.navigate("ResetPassword");
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const forgotPassword = async () => {
    if (!email) return;
    try {
      const response = await forgotPasswordMutation({
        variables: { input: { email } },
      });
      const successMessage = response.data.forgotPassword.message;
      displayBottomSheet(successMessage, false);
    } catch (error) {
      displayBottomSheet(error.message, true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Image source={fav} style={styles.fav} />
          <CustomText style={Global.h2} weight="medium">
            Tugela
          </CustomText>
        </View>
        <CustomText weight="medium" style={Global.h3}>
          Forgot Password
        </CustomText>
      </View>
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.form}>
          <View>
            <CustomInput
              type="Email"
              label="Email"
              placeholder={"Enter your email address"}
              onChange={handleEmailChange}
            />

            <CustomButton
              title={"Send reset instructions"}
              disabled={!email}
              onPress={forgotPassword}
            />
            <View style={styles.account}>
              <Button onPress={navigateToLogin} type="clear">
                <CustomText style={styles.forgot} weight="semibold">
                  Return to Sign In
                </CustomText>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <CustomBottomSheet
        visible={visible}
        onClose={closeBottomSheet}
        isError={isError}
        message={bottomSheetMessage}
        onPress={isError ? closeBottomSheet : navigateToOtp}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
    alignItems: "center",
  },
  fav: {
    width: 50,
    height: 50,
    marginRight: 4,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  account: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  forgot: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
