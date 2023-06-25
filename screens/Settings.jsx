import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import colors from "../colors";
import CustomText from "../components/CustomText";
import { SettingsData } from "../data/settingsData";
import Header from "../components/Header";
const Item = ({ title }) => (
  <View style={styles.item}>
    <CustomText style={styles.title} weight="medium">
      {title}
    </CustomText>
  </View>
);
const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={"Settings"}
        iconStyle={styles.iconContainer}
        iconName="long-arrow-left"
        color={colors.white}
        size={24}
      />
      <View style={styles.list}>
        <FlatList
          data={SettingsData}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 0.9,
    paddingVertical: 46,
    paddingHorizontal: 30,
  },
  item: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    color: colors.text,
  },
  text: {
    fontSize: 20,
    color: colors.primary,
  },

  keyboardAvoidingView: {
    flex: 0.3,
  },
});
