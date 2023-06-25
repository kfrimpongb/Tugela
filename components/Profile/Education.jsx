import { View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import colors from "../../colors";
import CustomText from "../CustomText";
import { Fonts } from "../../theme";
import { Button } from "react-native-paper";
const Education = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <CustomText style={{ fontSize: 18, color: colors.title }} weight="bold">
          Education
        </CustomText>
      </View>
      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Ashesi University
        </Button>
        <Button
          mode="outlined"
          style={styles.button1}
          labelStyle={styles.buttonText}
        >
          Datacamp
        </Button>

        <Button
            mode="outlined"
            style={styles.button1}
            labelStyle={styles.buttonText}
        >
          Coursera
        </Button>

      </View>
    </SafeAreaView>
  );
};

export default Education;

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
  buttonGroup: {
    flexDirection: "column",
    marginVertical: 10,
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "50%",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  button1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "90%",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.primary,
    width: "100%",
  },
});
