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
import DropdownSelect from "react-native-input-select";
import { Fonts } from "../../theme";
const Onboarding = () => {
  const pagerRef = useRef(null);
  const [initialPage, setInitialPage] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState(avata);
  const [usertype, setUsertype] = useState("");

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
          <DropdownSelect
            label="Select User Type"
            placeholder="Select"
            options={[
              { label: "Freelancer", value: "1" },
              { label: "Client", value: "2" },
            ]}
            selectedValue={usertype}
            onValueChange={(itemValue) => setUsertype(itemValue)}
            placeholderStyle={{
              color: "purple",
              fontSize: 15,
              fontWeight: "500",
            }}
            labelStyle={{
              color: colors.label,
              fontSize: 14,
              fontFamily: Fonts.regular,
            }}
            dropdownHelperTextStyle={{
              color: "green",
              fontWeight: "900",
            }}
            modalBackgroundStyle={{
              backgroundColor: "rgba(196, 198, 246, 0.5)",
            }}
            helperText="The placeholder has been styled"
            checkboxComponent={<View style={styles.radioButton} />}
            checkboxComponentStyles={{
              checkboxSize: 15,
              checkboxStyle: {
                backgroundColor: "purple",
                borderRadius: 30, // To get a circle - add the checkboxSize and the padding size
                padding: 5,
                borderColor: "red",
              },
              checkboxLabelStyle: { color: "red", fontSize: 20 },
            }}
            selectedItemStyle={{
              color: "hotpink",
              fontWeight: "900",
            }}
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
    marginTop: 10,
  },
  form: {
    flex: 2,
    flexDirection: "column",
    marginVertical: 20,
  },
});
