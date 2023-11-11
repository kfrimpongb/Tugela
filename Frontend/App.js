import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigations/AppNavigator";
import AuthProvider from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import loadFonts from "./loadFonts";
import { TamaguiProvider } from "tamagui";
import appConfig from "./tamagui.config";

export default function App() {
  const fontLoaded = loadFonts();
  if (!fontLoaded) {
    return null;
  }
  return (
    <TamaguiProvider config={appConfig}>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
    </TamaguiProvider>
  );
}
