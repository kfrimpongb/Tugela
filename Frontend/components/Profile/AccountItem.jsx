import { View, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { AccountData } from "../../data/AccountData";
import CustomText from "../CustomText";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../colors";

const AccountItem = () => {
  return (
    <ScrollView style={{ flex: 1, marginVertical: 18 }}>
      {AccountData.map(({ id, title, icon }) => (
        <View key={id} style={styles.item}>
          <View style={styles.perItem}>
            <FontAwesome5 name={icon} size={24} color={colors.primary} />
            <CustomText
              style={{
                flex: 1,
                color: colors.title,
                marginLeft: 20,
                fontSize: 16,
              }}
            >
              {title}
            </CustomText>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default AccountItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "column ",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  perItem: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
