import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import colors from "../colors";
import { Fonts } from "../theme";
const CheckBox = ({ label, isChecked = false, onCheckChange }) => {
  const [checked, setChecked] = useState(isChecked);

  const handlePress = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onCheckChange && onCheckChange(newCheckedState);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <FontAwesome name="check" size={15} color="white" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderColor: colors.space,
    borderRadius: 6,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: colors.primary,
    flexWrap: "wrap",
  },
};

export default CheckBox;
