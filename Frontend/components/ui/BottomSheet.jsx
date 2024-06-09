// SignUpBottomSheet.js
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { BottomSheet } from "@rneui/themed";
import CustomText from "../../components/ui/Text";
import CustomButton from "../../components/Button";
import colors from "../../colors";
import check from "../../assets/images/check.png";
import error from "../../assets/images/error.png";

const CustomBottomSheet = ({
  visible,
  onClose,
  isError,
  message,
  onPress,
  isSendError,
}) => {
  // Determine the source of the image based on isError and isSendError
  const imageSource = isError || isSendError ? error : check;

  // Determine the title of the button
  const buttonTitle = isError || isSendError ? "Okay" : "Continue";

  // Determine the title message
  const titleMessage = isError || isSendError ? "Failed" : "Success";
  return (
    <BottomSheet isVisible={visible} modalProps={{}}>
      <View style={styles.bottomSheet}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CustomText
            weight="semibold"
            style={{ fontSize: 16, color: colors.text }}
          >
            Close
          </CustomText>
        </TouchableOpacity>
        <Image source={imageSource} style={styles.check} />
        <View style={styles.messageContainer}>
          <CustomText weight="semibold" style={{ fontSize: 24 }}>
            {titleMessage}
          </CustomText>
          <CustomText
            weight="regular"
            style={{ fontSize: 16, textAlign: "center", paddingTop: 4 }}
          >
            {message}
          </CustomText>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton title={buttonTitle} onPress={onPress} />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  // Define your styles here
  bottomSheet: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  closeButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingVertical: 32,
  },
  check: {
    width: 100,
    height: 100,
    marginRight: 4,
    marginBottom: 14,
  },
  messageContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 60,
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: 16,
  },
});

export default CustomBottomSheet;
