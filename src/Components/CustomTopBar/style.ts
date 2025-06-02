import { StyleSheet } from "react-native";
import { AllColors } from "../../Constants/COLORS";
import { Fonts, fontSize } from "../../Constants/Fonts";
import metrics from "../../Constants/Metrics";
export default StyleSheet.create({
  viewmain: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  viewRow: {
    flexDirection: "row",
    height: "100%",
    borderRadius: metrics.hp3,
    marginHorizontal: metrics.hp1,
  },
  viewButtonContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  viewBottomLine: { height: 1 },
  textButton: {
    fontFamily: Fonts.AfacadSemibold,
    fontSize: fontSize(14),
    marginLeft: metrics.hp0_5,
  },
  viewFlex: {
    flex: 1,
  },
});
