import { StyleSheet, SafeAreaView, Image, View } from "react-native";
import React, { useState } from "react";
import colors from "../colors";

import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@rneui/themed";
import CustomText from "../components/ui/Text";
import onboard from "../assets/images/onboard.jpg";
import fav from "../assets/images/fav.png";
import { Fonts } from "../theme";
import { Global } from "../globalStyles";

const SplashScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const navigateToLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
        <CustomText style={Global.h1}>Tugela</CustomText>
        <CustomText style={Global.h3}>Work from</CustomText>
        <CustomText style={Global.h3}>Anywhere.....Anytime</CustomText>
      </View>

      <Button
        style={styles.button}
        title="Get Started"
        type="solid"
        size="lg"
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.buttonContainer}
      />
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
  button: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    color: colors.white,
    width: "90%",
    height: "80%",
    borderRadius: 10,
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
  buttonContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 20,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
