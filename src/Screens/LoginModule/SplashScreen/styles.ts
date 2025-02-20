import { Dimensions, StyleSheet } from "react-native";
import { AllColors } from "../../../Constants/COLORS";
import SplashScreen from "./SplashScreen";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: AllColors.white,
    justifyContent:'center',
    alignSelf:'center'
  },
  SplashScreen: {
    height: "30%",
    width: "30%",
    alignSelf:'center'
  },
});
