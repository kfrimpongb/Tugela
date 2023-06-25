import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../colors";

const options = ["Data Science", "Backend", "Frontend", "Product Design"];

const CustomDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const onSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text>{selectedOption || "Category"}</Text>
        <MaterialIcons
          name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => onSelect(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "60%",
    backgroundColor: colors.white,
  },
  button: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,

    borderColor: "#000",
  },
  dropdown: {
    width: "100%",
    position: "absolute",
    top: 50,
    zIndex: 100,
    backgroundColor: colors.white,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 6,
  },
  dropdownOption: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    borderColor: "#000",
    paddingHorizontal: 20,
    zIndex: 100,
  },
});

export default CustomDropDown;
