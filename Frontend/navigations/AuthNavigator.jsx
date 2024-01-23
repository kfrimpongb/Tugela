import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ForgotPassword from "../screens/auth/ForgotPassword";
import ResetPassword from "../screens/auth/ResetPassword";
import Back from "../components/ui/Back";
import Onboarding from "../screens/auth/Onboarding";
import SignupOTP from "../screens/auth/SignupOTP";
import ForgotOTP from "../screens/auth/ForgotOTP";
const Stack = createStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignupOTP"
        component={SignupOTP}
        options={{
          headerLeft: () => <Back />,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ForgotOTP"
        component={ForgotOTP}
        options={{
          headerLeft: () => <Back />,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          headerLeft: () => <Back />,
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
