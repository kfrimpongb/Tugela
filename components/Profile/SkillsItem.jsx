import { View, StyleSheet } from "react-native";
import React from "react";
import { Chip } from "react-native-paper";
import CustomText from "../CustomText";
import colors from "../../colors";

const SkillsItem = () => {
  return (
    <View style={styles.chip}>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Python</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">SQL</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Scikit-Learn</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Beautiful Soup</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Selenium</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Keras</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">NLP</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">Churn Analysis</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">SEO</CustomText>
      </Chip>
      <Chip
        onPress={() => console.log("Pressed")}
        style={{
          borderRadius: 50,
          backgroundColor: colors.background,
        }}
      >
        <CustomText weight="medium">AWS Lambda</CustomText>
      </Chip>
    </View>
  );
};

export default SkillsItem;
const styles = StyleSheet.create({
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
