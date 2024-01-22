import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigations/AppNavigator";
import AuthProvider from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadFonts from "./loadFonts";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://18.157.169.254:3005/graphql",
  cache: new InMemoryCache(),
});
export default function App() {
  const [fontsLoaded] = LoadFonts();
  if (!fontsLoaded) {
    return null;
  }
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <StatusBar animated={true} style="auto" />
            <AppNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
