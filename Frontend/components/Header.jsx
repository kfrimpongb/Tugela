import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React from "react";
import CustomText from "./CustomText";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import colors from "../colors";

const Header = ({ title, iconName, iconStyle, color, size, onPress }) => {
  const exitApp = () => {
    BackHandler.exitApp();
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={[styles.iconContainer, iconStyle]}
        onPress={onPress}
      >
        <FontAwesome name={iconName} size={size} color={color} />
      </TouchableOpacity>
      <CustomText weight="bold" style={styles.text}>
        {title}
      </CustomText>
      <TouchableOpacity onPress={exitApp}>
        <FontAwesome5 name="power-off" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    color: colors.primary,
  },
});
