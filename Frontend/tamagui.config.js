// The v2 config imports the css driver on web and react-native on native
// For reanimated: @tamagui/config/v2-reanimated
// For react-native only: @tamagui/config/v2-native

import { config } from "@tamagui/config/v2";
import { createTamagui } from "tamagui"; // or '@tamagui/core'

const appConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts, // Spread any existing font configurations
    DMSans: {
      // Define your DM Sans font styles
      regular: "DMSans_400Regular", // Assuming 'DMSans-Regular' is the name used when loading the font
      medium: "DMSans_500Medium",
      bold: "DMSans_700Bold",
      // Add other styles as needed
    },
  },
});

export default appConfig;
