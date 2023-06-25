import { View, StyleSheet } from "react-native";
import React from "react";
import colors from "../colors";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomDropDown from "./CustomDropdown";

const Filter = () => {
  return (
    <View style={styles.container}>
      <CustomDropDown />
      <View style={styles.iconContainer}>
        <FontAwesome5 name="filter" size={24} color={colors.title} />
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  iconContainer: {
    flex: 0.4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 5,
  },
});
