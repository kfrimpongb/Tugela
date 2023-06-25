import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../../colors";
import CustomText from "../CustomText";
import { Fonts } from "../../theme";
import { useNavigation } from "@react-navigation/native";

const Jobs = () => {
  const navigation = useNavigation();
  const navigateToHome = () => {
    navigation.navigate("home");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <CustomText style={{ fontSize: 18, color: colors.title }} weight="bold">
          Jobs
        </CustomText>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: 10,
          columnGap: 20,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <CustomText style={{ fontSize: 18, color: colors.text }}>
          When you are awarded a job,
        </CustomText>
        <CustomText style={{ fontSize: 18, color: colors.text }}>
          it will show.
        </CustomText>
      </View>
      <CustomText
        style={{ textAlign: "center", fontSize: 18, color: colors.text }}
      >
        Keep on Applying!
      </CustomText>
      <TouchableOpacity
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
        onPress={navigateToHome}
      >
        <CustomText
          style={{
            textAlign: "center",
            fontSize: 26,
            color: colors.primary,
            textDecorationLine: "underline",
            textDecorationStyle: "dotted",
          }}
          weight="bold"
        >
          Search for Jobs
        </CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Jobs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 30,
    fontFamily: Fonts.regular,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 40,
  },
});
