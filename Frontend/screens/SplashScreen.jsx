import { StyleSheet, SafeAreaView, Image } from "react-native";
import React from "react";
import colors from "../colors";

import { Fonts } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { XStack, Text, Button, YStack, Stack } from "tamagui";
import onboard from "../assets/images/onboard.jpg";
import fav from "../assets/images/fav.png";

const SplashScreen = () => {
  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={styles.container}>
      <YStack space="$3" justifyContent="center" alignItems="center" flex={5}>
        <Image source={onboard} style={styles.image} />
        <Image source={fav} style={styles.fav} />
      </YStack>
      <YStack
        space="$4"
        paddingVertical="$3"
        justifyContent="center"
        alignItems="center"
        width={"100%"}
        flex={3}
      >
        <Text fontSize={40} fontFamily={Fonts.bold} color={colors.title}>
          Tugela
        </Text>
        <Text fontSize={20} fontFamily={Fonts.regular} color={colors.text}>
          Work from
        </Text>
        <Text fontSize={20} fontFamily={Fonts.regular} color={colors.text}>
          Anywhere.....Anytime
        </Text>
      </YStack>
      <YStack flex={1} justifyContent="center" paddingHorizontal="$4">
        <Button style={styles.button} size="$6">
          Get Started
        </Button>
      </YStack>
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
  },
  text: {
    fontFamily: Fonts.bold,
  },
  button: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    backgroundColor: colors.primary,
    color: colors.white,
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
    marginVertical: -35,
  },
});
