import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTab from "./BottomTab";

const Stack = createStackNavigator();
const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
