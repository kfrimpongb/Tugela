import { View, StyleSheet, SafeAreaView, Image } from "react-native";
import React from "react";
import colors from "../colors";
import CustomText from "../components/CustomText";
import { Button } from "react-native-paper";
import { Fonts } from "../theme";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText weight="semiBold" style={styles.text}>
          Work from
        </CustomText>
        <CustomText weight="semiBold" style={styles.text}>
          Anywhere...Anytime
        </CustomText>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/splash.png")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          buttonColor={colors.primary}
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={navigateToLogin}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    fontFamily: Fonts.regular,
  },
  textContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: colors.white,
    marginVertical: 4,
  },
  imageContainer: {
    flex: 0.4,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "flex-end",
    marginHorizontal: 14,
    paddingBottom: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
});
