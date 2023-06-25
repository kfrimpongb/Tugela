import { View, Text } from "react-native";
import React, { useContext } from "react";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { AuthContext } from "../context/AuthContext";

const AppNavigator = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AppNavigator must be used within an AuthProvider");
  }
  const { userAuthenticated } = authContext;
  return userAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
