import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import CustomText from "./Text";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Back = () => {
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity style={styles.back} onPress={navigateBack}>
      <Icon name={"arrow-left"} size={16} />
      <CustomText style={{ paddingLeft: 8, fontSize: 14 }} weight="medium">
        Back
      </CustomText>
    </TouchableOpacity>
  );
};

export default Back;

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
});
