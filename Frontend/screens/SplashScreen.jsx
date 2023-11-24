import { StyleSheet, SafeAreaView, Image, View } from "react-native";
import React, { useState } from "react";
import colors from "../colors";

import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import CustomText from "../components/ui/Text";
import onboard from "../assets/images/onboard.jpg";
import fav from "../assets/images/fav.png";
import { Fonts } from "../theme";
import { Global } from "../globalStyles";
import CustomButton from "../components/Button";

const SplashScreen = () => {
  const navigation = useNavigation();

  const navigateToLogin = () => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Images}>
        <Image source={onboard} style={styles.image} />
        <Image source={fav} style={styles.fav} />
      </View>
      <View style={styles.content}>
        <CustomText style={Global.h1} weight="medium">
          Tugela
        </CustomText>
        <CustomText style={Global.h4}>Work from</CustomText>
        <CustomText style={Global.h4}>Anywhere.....Anytime</CustomText>
      </View>
      <View style={styles.Button}>
        <CustomButton
          title={"Get Started"}
          onPress={navigateToLogin}
          disabled={false}
          size="lg"
        />
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
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  text: {
    fontFamily: Fonts.bold,
  },

  image: {
    width: "100%",
    height: "100%",
  },
  fav: {
    width: 70,
    height: 70,
    position: "absolute",
    bottom: 0,
    marginVertical: -45,
  },
  Images: {
    flex: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  Button: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});
