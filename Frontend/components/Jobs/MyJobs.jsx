import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { DemandData } from "../../data/DemandData";
import colors from "../../colors";
import CustomText from "../CustomText";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Chip, Snackbar, ActivityIndicator } from "react-native-paper";
import { Fonts } from "../../theme";
import CustomModal from "../Modal";

const Item = ({ title, time, category, salary, description }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setCancelled(!cancelled);
  };
  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        setModalVisible(false);
        if (!cancelled) {
        }
      }, 3000);
    }
  }, [modalVisible]);

  const onCancel = () => {
    setCancelled(true);
    toggleModal();
  };

  const [visible, setVisible] = React.useState(false);

  const [isClicked, setIsClicked] = useState(false);

  const togglePress = () => setVisible(!visible);

  const heartClick = () => {
    setIsClicked((prevState) => !prevState);
  };
  return (
    <View style={styles.item}>
      <View style={styles.perItem}>
        <View style={styles.jobTitle}>
          <CustomText weight="bold" style={{ fontSize: 22 }}>
            {title}
          </CustomText>
          <CustomText weight="regular" style={{ fontSize: 14 }}>
            {time}
          </CustomText>
        </View>
        <View style={styles.category}>
          <CustomText
            weight="regular"
            style={{ fontSize: 18, color: colors.primary }}
          >
            {category}
          </CustomText>
          <View style={styles.categoryIcon}>
            <TouchableOpacity style={{ marginRight: 8 }} onPress={heartClick}>
              {isClicked ? (
                <FontAwesome name="heart-o" size={28} color={colors.primary} />
              ) : (
                <FontAwesome name="heart" size={28} color={colors.primary} />
              )}
            </TouchableOpacity>
            <Button
              onPress={togglePress}
              style={[
                visible
                  ? {
                      borderWidth: 2,
                      borderColor: colors.accent,
                    }
                  : {
                      borderWidth: 2,
                      borderColor: colors.primary,
                    },
              ]}
            >
              <CustomText
                style={[
                  visible
                    ? { color: colors.accent }
                    : { color: colors.primary },
                ]}
                weight="semiBold"
              >
                {" "}
                {visible ? "Accepted" : "Open"}
              </CustomText>
            </Button>
          </View>
        </View>
        <View style={styles.salary}>
          <View style={styles.salaryText}>
            <CustomText
              style={{ marginVertical: 5, fontSize: 24 }}
              weight="bold"
            >
              ${salary}
            </CustomText>
          </View>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={toggleModal}
          >
            {visible ? "Decline" : "Apply Now"}
          </Button>
          <CustomModal
            visible={modalVisible}
            toggleModal={toggleModal}
            style={styles.modal}
          >
            <View style={{ paddingBottom: 50 }}>
              <CustomText
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  color: colors.text,
                  paddingVertical: 5,
                }}
                weight="bold"
              >
                Your application
              </CustomText>
              <CustomText
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  color: colors.text,
                }}
                weight="bold"
              >
                has been sent.
              </CustomText>
              {/*<CustomText*/}
              {/*  style={{*/}
              {/*    fontSize: 20,*/}
              {/*    textAlign: "center",*/}
              {/*    color: colors.text,*/}
              {/*    paddingTop: 20,*/}
              {/*  }}*/}
              {/*  weight="regular"*/}
              {/*>*/}
              {/*  /!*visiting*!/*/}
              {/*</CustomText>*/}
              {/*<CustomText*/}
              {/*  style={{*/}
              {/*    fontSize: 22,*/}
              {/*    textAlign: "center",*/}
              {/*    color: colors.text,*/}
              {/*    paddingTop: 20,*/}
              {/*  }}*/}
              {/*  weight="bold"*/}
              {/*>*/}
              {/*  /!*www.upwork.com*!/*/}
              {/*</CustomText>*/}
            </View>
            <ActivityIndicator
              animating={true}
              color={colors.primary}
              size={"large"}
              style={{ paddingBottom: 30 }}
            />
            <Button
              onPress={onCancel}
              mode="outlined"
              style={{
                width: "60%",
                borderWidth: 2,
                borderRadius: 50,
                borderColor: colors.primary,
                paddingVertical: 5,
              }}
            >
              <CustomText
                style={{ color: colors.primary, fontSize: 18 }}
                weight="medium"
              >
                Cancel
              </CustomText>
            </Button>
          </CustomModal>
        </View>
        <View style={styles.description}>
          <CustomText style={{ fontSize: 14, lineHeight: 24 }}>
            {description}
          </CustomText>
        </View>
        <View style={styles.chip}>
          <CustomText>Employer Name</CustomText>
          <View style={{ flexDirection: "row" }}>
            <CustomText>24 Proposal |</CustomText>
            <CustomText>#5646541</CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};
const MyJobs = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={DemandData}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            time={item.time}
            category={item.category}
            salary={item.salary}
            description={item.description}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default MyJobs;

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
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 0.9,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "column",
    width: "100%",
    paddingVertical: 20,
  },
  perItem: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  salary: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  salaryText: {
    flexDirection: "column",
  },
  description: {
    marginVertical: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  jobTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 18,
  },
  categoryIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
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
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "45%",
  },
});
