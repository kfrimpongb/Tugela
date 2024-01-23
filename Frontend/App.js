import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigations/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadFonts from "./loadFonts";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: "http://18.157.169.254:3005/graphql",
  cache,
  typeDefs: `
    extend type Query {
      isAuthenticated: Boolean!
    }
  `,
  resolvers: {},
});

cache.writeQuery({
  query: gql`
    query GetAuthState {
      isAuthenticated
    }
  `,
  data: {
    isAuthenticated: false,
  },
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
          <StatusBar animated={true} style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
