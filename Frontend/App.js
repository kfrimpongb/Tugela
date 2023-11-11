import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigations/AppNavigator";
import AuthProvider from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import loadFonts from "./loadFonts";

export default function App() {
  const fontLoaded = loadFonts();
  if (!fontLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
