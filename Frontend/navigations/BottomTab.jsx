import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import colors from "../colors";
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "home") {
            iconName = "home";
          } else if (route.name === "jobs") {
            iconName = "briefcase";
          } else if (route.name === "profile") {
            iconName = "user";
          } else if (route.name === "settings") {
            iconName = "cog";
          } else if (route.name === "notification") {
            iconName = "bell";
          }

          return (
            <FontAwesome5
              name={iconName}
              size={24}
              color={focused ? "white" : "#B2C0C4"}
            />
          );
        },
        tabBarActiveBackgroundColor: colors.primary,
        tabBarLabel: () => null,
      })}
      tabBarStyle={styles.tabBarStyle}
      tabBarItemStyle={styles.tabBarItemStyle}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "blue", // Replace with your desired background color
  },
  tabBarItemStyle: {
    // Add any additional styles for the tab bar items if needed
  },
});

export default BottomTab;
