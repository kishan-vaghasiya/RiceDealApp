import { StyleSheet } from "react-native";
import metrics from "../../Constants/Metrics";
import { Fonts, fontSize } from "../../Constants/Fonts";
import { AllColors } from "../../Constants/COLORS";
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    marginTop: metrics.hp0_5,
  },
  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchImage: {
    width: metrics.hp5,
    height: metrics.hp5,
    borderRadius: metrics.hp2_5,
  },
  notificationImage: {
    width: metrics.hp5,
    height: metrics.hp5,
    marginLeft: metrics.hp1_5,
    borderRadius: metrics.hp2_5,
  },
  touchBack: {
    height: metrics.hp4_5,
    width: metrics.hp5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: metrics.hp1,
  },
  touchDots: {
    height: metrics.hp4,
    width: metrics.hp1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: metrics.hp1,
    alignSelf: "center",
  },
  backWithMenu: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",

    paddingLeft: metrics.hp1,
  },
  screenText: {
    fontSize: fontSize(24),
    color: AllColors.black,
    marginLeft: metrics.hp1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    fontFamily: Fonts.AfacadSemibold,
    textAlign: "left",
    left: metrics.hp2,
  },

  profileBackground: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bacgroundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 52 / 2,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },

  investHeaderView: {
    height: metrics.hp7,
    width: "105%",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  investSubHeader: {
    height: "100%",
    width: "20%",
    marginLeft: metrics.hp1,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: metrics.hp2_5,
    alignItems: "center",
    alignSelf: 'center'
  },
  userFonts: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: fontSize(14),
    color: AllColors.white,
  },
  userSubFont: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: fontSize(12),
    color: AllColors.subText,
  },
  searchMainView: {
    height: "100%",
    width: "80%",
    flexDirection: "row",
    alignSelf: "flex-start",

    alignItems: "center",
    justifyContent: "flex-start",
  },
});
