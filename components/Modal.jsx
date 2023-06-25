import React from "react";
import { Modal, View, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CustomModal = ({ size, visible, toggleModal, children, style }) => {
  let modalHeight;

  switch (size) {
    case "small":
      modalHeight = windowHeight * 0.25;
      break;
    case "large":
      modalHeight = windowHeight * 0.75;
      break;
    case "full":
      modalHeight = windowHeight;
      break;
    default:
      modalHeight = windowHeight * 0.6;
      break;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { height: modalHeight }, style]}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: windowWidth * 0.9,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CustomModal;
