import React, { useState, useContext } from "react";
import {
  View,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../../components/CustomText";
import colors from "../../colors";
import { Fonts } from "../../theme";
import CheckBox from "../../components/CheckBox";
import * as yup from "yup";
import { useFormik } from "formik";
import { AuthContext } from "../../context/AuthContext";

const validationSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(50, "Full Name can't be longer than 50 characters")
    .required("Full Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setFocused] = useState(false);
  const [fullname, setFullName] = useState(false);
  const [isFocusedPassword, setFocusedPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("LoginScreen must be used within an AuthProvider");
  }
  const { setUserAuthenticated } = authContext;
  const handleCheckChange = (checked) => {
    setChecked(checked);
    console.log("Checkbox checked:", checked);
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: () => {
      if (formik.isValid) {
        setUserAuthenticated(true);
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Validation Error",
          "Please fill in all the required fields."
        );
      }
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Image source={require("../../assets/images/signup.png")} />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Full Name"
              value={formik.values.fullname}
              onChangeText={formik.handleChange("fullname")}
              style={fullname ? styles.inputActive : styles.input}
              onFocus={() => setFullName(true)}
              onBlur={() => setFullName(false)}
              maxLength={40}
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <CustomText style={styles.errorText}>
                {formik.errors.fullname}
              </CustomText>
            )}
            <TextInput
              placeholder="Email Address"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              style={isFocused ? styles.inputActive : styles.input}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={40}
            />
            {formik.touched.email && formik.errors.email && (
              <CustomText style={styles.errorText}>
                {formik.errors.email}
              </CustomText>
            )}

            <TextInput
              secureTextEntry
              placeholder="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              style={isFocusedPassword ? styles.inputActive1 : styles.input1}
              onFocus={() => setFocusedPassword(true)}
              onBlur={() => setFocusedPassword(false)}
            />
            {formik.touched.password && formik.errors.password && (
              <CustomText style={styles.errorText}>
                {formik.errors.password}
              </CustomText>
            )}
            <TextInput
              secureTextEntry
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              style={confirmPassword ? styles.inputActive1 : styles.input1}
              onFocus={() => setConfirmPassword(true)}
              onBlur={() => setConfirmPassword(false)}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <CustomText style={styles.errorText}>
                  {formik.errors.confirmPassword}
                </CustomText>
              )}

            <View style={styles.check}>
              <CheckBox
                label="I agree to Tugela’s Terms of Service and Privacy Policy."
                isChecked={checked}
                onCheckChange={handleCheckChange}
              />
            </View>
            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                buttonColor={colors.primary}
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => formik.handleSubmit()}
              >
                Sign Up
              </Button>
              <Button
                mode="outlined"
                style={styles.button1}
                labelStyle={styles.buttonText1}
                onPress={navigateToLogin}
              >
                Sign In
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  formContainer: {
    flex: 0.6,
    marginHorizontal: 22,
    marginTop: 10,
  },
  passInput: {
    width: "60%",
  },
  errorText: {
    color: colors.danger,
    marginVertical: 6,
  },
  formPass: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  check: {
    marginTop: 5,
  },
  textButton: {
    color: colors.danger,
  },
  labelButton: {
    fontSize: 16,
    color: colors.danger,
    textDecorationLine: "underline",
    textDecorationColor: colors.danger,
    textDecorationStyle: "dotted",
  },
  input: {
    height: 60,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: Fonts.regular,
    marginVertical: 6,
  },
  inputActive: {
    height: 60,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.space,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: Fonts.medium,
    elevation: 5,
    marginVertical: 6,
  },

  input1: {
    height: 60,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: Fonts.regular,
    marginVertical: 6,
    width: "75%",
  },
  inputActive1: {
    width: "75%",
    height: 60,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.space,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: Fonts.medium,
    elevation: 5,
  },
  keyboardAvoidingView: {
    flex: 0.3,
  },
  buttonGroup: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "44%",
  },
  button1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "48%",
    borderRadius: 50,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  buttonText1: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.primary,
  },
});
