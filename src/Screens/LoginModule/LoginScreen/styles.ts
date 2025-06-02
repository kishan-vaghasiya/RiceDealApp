import { Dimensions, Platform, StyleSheet } from "react-native";
import { AllColors } from "../../../Constants/COLORS";
import metrics from "../../../Constants/Metrics";
import { Fonts } from "../../../Constants/Fonts";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: AllColors.white,
  },
  logoImage: {
    width: "100%",
    height: metrics.hp30,
    marginTop: 10,
    // marginTop: Platform.OS == "android" ? metrics.hp9 : metrics.hp1,
    borderRadius: 8,
  },
  /*  logoImage: {
     width: metrics.hp80, // 40% of screen width
     // width: 400,
     height: metrics.hp23, // Adjust based on the logo aspect ratio
     alignSelf: 'center',
     marginTop: Platform.OS === "android" ? metrics.hp5 : metrics.hp3,
     // borderWidth: 1,
   }, */
  mailImage: {
    width: "30%",
    justifyContent: 'center',
    alignSelf: 'center',
    height: metrics.hp9,
    marginTop: Platform.OS == "android" ? metrics.hp3 : metrics.hp3,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 30,
    color: AllColors.black,
    marginTop: metrics.hp5,
    lineHeight: 35,
    textAlign: 'center'
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadSemibold,
    fontWeight: 'semibold',
    fontSize: 22,
    color: AllColors.black,
    marginTop: metrics.hp1,
  },
  countryCode: {
    height: metrics.hp6,
    width: "18%",
    backgroundColor: AllColors.textInput,
    borderRadius: metrics.hp1,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    color: AllColors.white,
    paddingVertical: 17,
    fontFamily: Fonts.AfacadMedium,
  },
  phoneNumberText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 18,
    color: AllColors.white,
    marginTop: metrics.hp5,
  },
  textInputView: {
    height: metrics.hp6,
    width: "80%",
    backgroundColor: AllColors.textInput,
    borderRadius: metrics.hp1,
    left: 5,
    paddingLeft: 11,
    fontSize: 14,
    color: AllColors.white,
    fontFamily: Fonts.AfacadBold,
  },
  InputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: metrics.hp2,
    flex: 1,
    marginRight: 5,
  },
  TermsView: {
    flexDirection: "row",
    marginTop: metrics.hp2,
    flex: 1,
    marginRight: 5,
  },
  marginView: {
    marginHorizontal: metrics.hp2,
    marginBottom: Platform.OS == "android" ? 0 : 150,
    flex: 1,
  },
  Privacy: {
    color: AllColors.subText,
    textDecorationLine: "underline",
    fontFamily: Fonts.AfacadRegular,
    fontSize: 15,
  },
  checkImage: {
    height: metrics.hp2_22,
    width: metrics.hp2_22,
  },
  commonText: {
    color: AllColors.subText,
    fontFamily: Fonts.AfacadRegular,
    fontSize: 15,
  },
  buttonView: {
    width: "100%",
    height: metrics.hp7,
    borderRadius: metrics.hp4,
    marginTop: metrics.hp3,
    justifyContent: "center",
    alignItems: "center",
  },
  touchView: {
    width: "100%",
    marginHorizontal: metrics.hp2,
    alignSelf: 'center',
    height: metrics.hp7,
    backgroundColor: AllColors.midGreen,
    alignItems: "center",
    justifyContent: "center",
    marginTop: metrics.hp2,
    borderRadius: metrics.hp2,

  },
  buttonInsideText: {
    fontSize: 20,
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.white,
  },
  DontTxt: {
    textAlign: 'right',
    marginVertical: 10,
    fontFamily: Fonts.AfacadMedium,
    fontSize: 18,
    marginRight: 5,
  },
  siguptxt: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 19,
    color: 'blue'
  }
});
