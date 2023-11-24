import React from "react";
import { Text as DefaultText } from "@rneui/themed";
import { Fonts } from "../../theme";

export default function CustomText({
  style,
  children,
  weight = "regular",
  ...props
}) {
  return (
    <DefaultText style={[{ fontFamily: Fonts[weight] }, style]} {...props}>
      {children}
    </DefaultText>
  );
}
