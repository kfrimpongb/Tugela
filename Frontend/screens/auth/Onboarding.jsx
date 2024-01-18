import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import PagerView from "react-native-pager-view";
import Freelancer from "./Freelancer";
import Client from "./Client";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Global } from "../../globalStyles";
import avata from "../../assets/images/profile.png";
import edit from "../../assets/images/edit.png";
import * as ImagePicker from "expo-image-picker";

const Onboarding = () => {
  const pagerRef = useRef(null);
  const [initialPage, setInitialPage] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState(avata);

  const handleNameChange = (text) => {
    setName(text);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage({ uri: result.uri });
    }
  };

  const moveToNext = () => {
    if (pagerRef.current) {
      pagerRef.current.setPage(initialPage + 1);
      setInitialPage(initialPage + 1);
    }
  };
  return (
    <PagerView
      ref={pagerRef}
      style={styles.pagerView}
      initialPage={initialPage}
      scrollEnabled
    >
      <View key="0" style={styles.container}>
        <View style={styles.profile}>
          <CustomText weight="medium" style={Global.h2}>
            Profile Update
          </CustomText>
          <View style={styles.upload}>
            {image && <Image source={image} style={styles.image} />}
            <TouchableOpacity style={styles.edit} onPress={pickImage}>
              <CustomText weight="medium" style={styles.text}>
                Add Photo
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView style={styles.form}>
          <CustomInput
            type="Text"
            label="Full Name"
            placeholder={"Enter your full name"}
            onChangeText={handleNameChange}
          />
        </KeyboardAvoidingView>
        <View style={styles.button}>
          <CustomButton title={"Continue"} onPress={moveToNext} />
        </View>
      </View>
      <Freelancer key="1" />
      <Client key="2" />
    </PagerView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 20,
  },
  profile: {
    width: "100%",
  },
  upload: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 200,
  },
  text: {
    fontSize: 18,
    color: colors.primary,
  },
  form: {
    flex: 2,
    flexDirection: "column",
    marginVertical: 20,
  },
});
