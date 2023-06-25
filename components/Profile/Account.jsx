import { View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import colors from "../../colors";
import CustomText from "../CustomText";
import { Fonts } from "../../theme";

import AccountItem from "./AccountItem";

const Account = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <CustomText style={{ fontSize: 18, color: colors.title }} weight="bold">
          Account
        </CustomText>
        <CustomText
          style={{
            fontSize: 18,
            color: colors.primary,
            textDecorationLine: "underline",
            textDecorationStyle: "dotted",
          }}
          weight="semiBold"
        >
          Edit
        </CustomText>
      </View>
      <AccountItem />
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    marginHorizontal: 20,
    fontFamily: Fonts.regular,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
