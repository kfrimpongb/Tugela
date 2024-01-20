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

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserMutation] = useMutation(CREATE_USER);
  const navigation = useNavigation();

  const navigateToOtp = () => {
    createUser();
    navigation.navigate("OTP");
  };
  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  const isFormValid = () => {
    return name !== "" && email !== "" && password !== "";
  };
  const handleNameChange = (text) => {
    // Add this function
    setName(text);
  };
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const createUser = async () => {
    if (!isFormValid()) return;

    console.log(name, email, password);

    try {
      const { data } = await createUserMutation({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      console.log("User created:", data.createUser);
      navigation.navigate("OTP");
    } catch (error) {
      console.error("Error creating user:", error.message);
      console.log(error);
    }
  };
  const keyboardVerticalOffset = Platform.OS === "ios" ? 10 : 0;
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
            type="Text"
            label="Full Name"
            placeholder="Enter your name"
            onChange={handleNameChange}
            value={name}
          />
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
            icon={"google"}
            iconColor={colors.primary}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
