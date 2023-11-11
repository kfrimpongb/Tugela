import {
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import colors from "../colors";

import { Fonts } from "../theme";
import { useNavigation } from "@react-navigation/native";

import onboard from "../assets/images/onboard.jpg";
import fav from "../assets/images/fav.png";

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
      <View>
        <Image source={onboard} style={styles.image} />
        <Image source={fav} style={styles.fav} />
      </View>
      <View>
        <Text fontSize={40} fontFamily={Fonts.bold} color={colors.title}>
          Tugela
        </Text>
        <Text fontSize={20} fontFamily={Fonts.regular} color={colors.text}>
          Work from
        </Text>
        <Text fontSize={20} fontFamily={Fonts.regular} color={colors.text}>
          Anywhere.....Anytime
        </Text>
      </View>
      <View>
        <Button
          style={styles.button}
          onPress={navigateToLogin}
          title="Get Started"
        ></Button>
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
