import React from "react";
import { Text as DefaultText } from "@rneui/themed";
import { Fonts } from "../../theme";

export default function CustomText(props) {
  return (
    <DefaultText
      {...props}
      style={[{ fontFamily: Fonts.regular }, props.style]}
    />
  );
}
