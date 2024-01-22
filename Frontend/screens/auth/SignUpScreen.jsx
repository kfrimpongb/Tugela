import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
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
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../utils/mutations";
import google from "../../assets/images/google.png";
import CustomBottomSheet from "../../components/ui/BottomSheet";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserMutation] = useMutation(CREATE_USER);
  const [visible, setVisible] = useState(false);
  const [bottomSheetMessage, setBottomSheetMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigation = useNavigation();

  const showBottomSheet = () => {
    setVisible(true);
    navigation.navigate("OTP");
  };
  const returnToSignUpScreen = () => {
    setVisible(!visible);
  };
  const navigateToOtp = () => {
    createUser();
    navigation.navigate("OTP", { email: email });
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

  const displayBottomSheet = (message, isError) => {
    setBottomSheetMessage(message);
    setIsError(isError);
    setVisible(true);
  };

  const createUser = async () => {
    if (!isFormValid()) return;

    console.log(email, password);

    try {
      const response = await createUserMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      console.log("User created:", response.data.message);

      const successMessage = response.data.signup.message;
      displayBottomSheet(successMessage, false);
    } catch (error) {
      displayBottomSheet(`${error.message}`, true);
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.title}>
            <Image source={fav} style={styles.fav} />
            <CustomText style={Global.h2} weight="medium">
              Tugela
            </CustomText>
          </View>
          <CustomText weight="regular" style={Global.h4}>
            Create an account
          </CustomText>
        </View>
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
          >
            <CustomInput
              type="Email"
              label="Email"
              placeholder={"Enter your email address"}
              onChange={handleEmailChange}
              value={email}
            />
            <CustomInput
              type="Password"
              label="Password"
              placeholder={"Enter your password"}
              onChange={handlePasswordChange}
              value={password}
            />
            <CustomButton
              title={"Create an account"}
              disabled={!isFormValid()}
              onPress={createUser}
            />
            <View style={styles.account}>
              <View style={styles.signup}>
                <CustomText style={Global.small}>
                  Already have an account?
                </CustomText>
                <TouchableOpacity onPress={navigateToLogin}>
                  <CustomText style={styles.caption} weight="semibold">
                    Sign In
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider}>
              <View style={styles.divide}></View>
              <CustomText
                style={{ fontSize: 14, color: colors.text }}
                weight="medium"
              >
                or
              </CustomText>
              <View style={styles.divide}></View>
            </View>
            <CustomButton
              title={"Sign in with Google"}
              disabled={false}
              icon={google}
              iconColor={colors.primary}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <CustomBottomSheet
        visible={visible}
        onClose={returnToSignUpScreen}
        isError={isError}
        message={bottomSheetMessage}
        onPress={isError ? returnToSignUpScreen : navigateToOtp}
      />
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    paddingVertical: 40,
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
    marginVertical: 40,
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
  check: {
    width: 100,
    height: 100,
    marginRight: 4,
    marginBottom: 14,
  },
});
