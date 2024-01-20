import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import DropdownSelect from "react-native-input-select";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Global } from "../../globalStyles";

const Client = ({ key }) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [usertype, setUsertype] = useState("");
  const [job, setJob] = useState("");
  const [timezone, setTimeZone] = useState("");

  const handleTitleChange = (text) => {
    setTitle(text);
  };
  const handleCityChange = (text) => {
    setCity(text);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.form}>
        <DropdownSelect
          label="Job Industry"
          placeholder="Select"
          options={[
            { label: "Ghana", value: "1" },
            { label: "Nigeria", value: "2" },
          ]}
          dropdownStyle={styles.dropdownStyle}
          selectedValue={job}
          onValueChange={(itemValue) => {
            setJob(itemValue);
          }}
          placeholderStyle={styles.placeholderStyle}
          labelStyle={styles.labelStyle}
          checkboxStyle={styles.checkBox}
          checkboxLabelStyle={styles.checkBoxLabel}
          modalBackgroundStyle={styles.modalBackground}
          selectedItemStyle={styles.selectedItems}
        />
        <CustomInput
          type="Text"
          label="Company Name"
          placeholder={"Enter your company name"}
          onChange={handleTitleChange}
          value={title}
        />
        <DropdownSelect
          label="Country"
          placeholder="Select"
          options={[
            { label: "Ghana", value: "1" },
            { label: "Nigeria", value: "2" },
          ]}
          dropdownStyle={styles.dropdownStyle}
          selectedValue={usertype}
          onValueChange={(itemValue) => {
            setUsertype(itemValue);
          }}
          placeholderStyle={styles.placeholderStyle}
          labelStyle={styles.labelStyle}
          checkboxStyle={styles.checkBox}
          checkboxLabelStyle={styles.checkBoxLabel}
          modalBackgroundStyle={styles.modalBackground}
          selectedItemStyle={styles.selectedItems}
        />
        <CustomInput
          type="Text"
          label="City"
          placeholder={"Enter your city"}
          onChange={handleCityChange}
          value={city}
        />
        <DropdownSelect
          label="TimeZone"
          placeholder="Select"
          options={[
            { label: "(+00:00) London,Lisbon", value: "1" },
            { label: "Nigeria", value: "2" },
          ]}
          dropdownStyle={styles.dropdownStyle}
          selectedValue={timezone}
          onValueChange={(itemValue) => {
            setTimeZone(itemValue);
          }}
          placeholderStyle={styles.placeholderStyle}
          labelStyle={styles.labelStyle}
          checkboxStyle={styles.checkBox}
          checkboxLabelStyle={styles.checkBoxLabel}
          modalBackgroundStyle={styles.modalBackground}
          selectedItemStyle={styles.selectedItems}
        />
      </ScrollView>
      <View style={styles.button}>
        <CustomButton title={"Continue"} />
      </View>
    </View>
  );
};

export default Client;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 20,
  },
  form: {
    flex: 1,
    width: "auto",
  },
  selectedItems: {
    color: colors.title,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  modalBackground: {
    backgroundColor: "rgba(0 , 0, 0, 0.25)",
  },
  checkBoxLabel: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    paddingVertical: 16,
    paddingHorizontal: 4,
    color: colors.label,
  },
  checkBox: {
    backgroundColor: colors.primary,
    borderColor: colors.borderColor,
    borderWidth: 2,
    borderRadius: 8,
  },
  labelStyle: {
    color: colors.label,
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  placeholderStyle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  dropdownStyle: {
    backgroundColor: colors.background,
    borderColor: colors.borderColor,
    height: 56,
  },
});
