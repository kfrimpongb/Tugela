import React, { createContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const navigation = useNavigation();

  return (
    <AuthContext.Provider
      value={{ userAuthenticated, setUserAuthenticated, navigation }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
