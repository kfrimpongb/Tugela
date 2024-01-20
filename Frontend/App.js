import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigations/AppNavigator";
import AuthProvider from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadFonts from "./loadFonts";
import * as Device from "expo-device";

export default function App() {
  const [fontsLoaded] = LoadFonts();
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar animated={true} style="auto" />
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
