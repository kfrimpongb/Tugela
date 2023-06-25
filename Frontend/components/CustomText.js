import React from "react";
import { Text } from "react-native";
import { Fonts } from "../theme";

const CustomText = ({ style, children, weight = "regular", ...props }) => {
  return (
    <Text style={[{ fontFamily: Fonts[weight] }, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
