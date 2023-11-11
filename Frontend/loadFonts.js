import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

export default function LoadFonts() {
  let [fontLoaded] = useFonts({
    DMSans_400Regular: DMSans_400Regular,
    DMSans_500Medium: DMSans_500Medium,
    DMSans_700Bold: DMSans_700Bold,
  });

  return fontLoaded;
}
