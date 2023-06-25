import React from "react";
import colors from "../colors";
import CustomText from "../components/CustomText";
import { NotificationsData } from "../data/NotificationData";
import Header from "../components/Header";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";

const Item = ({ title, time }) => (
  <View style={styles.item}>
    <View style={styles.perItem}>
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator}></View>
      </View>
      <View style={styles.itemText}>
        <CustomText style={styles.title} weight="medium">
          {title}
        </CustomText>
        <CustomText style={styles.time}>{time}</CustomText>
      </View>
    </View>
  </View>
);

const Notifications = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={"Notifications"}
        iconStyle={styles.iconContainer}
        iconName="long-arrow-left"
        color={colors.white}
        size={24}
      />
      <View style={styles.list}>
        <FlatList
          data={NotificationsData}
          renderItem={({ item }) => (
            <Item title={item.title} time={item.time} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Notifications;

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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  item: {
    width: "100%",
    paddingVertical: 20,
  },
  perItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  indicatorContainer: {
    flex: 0.1,
    alignItems: "center",
    marginRight: 2,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  itemText: {
    flex: 0.9,
  },
  title: {
    fontSize: 16,
    color: colors.title,
  },
  time: {
    marginTop: 10,
    textAlign: "right",
    color: colors.title,
  },
});
