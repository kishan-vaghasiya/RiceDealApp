import { Dimensions, Platform, StyleSheet } from "react-native";
import { AllColors } from "../../../Constants/COLORS";
import { Fonts, fontSize } from "../../../Constants/Fonts";
import metrics from "../../../Constants/Metrics";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AllColors.appDarkBackGround,
  },
  container: {
    paddingHorizontal: 16,
    marginTop: metrics.hp1,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 20,
    color: "#FFF",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "600",
  },
  sepratorSection: {
    paddingBottom: 10,
    paddingTop: 10,
  },
  profileBackground: {
    width: "100%",
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: AllColors.black,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: fontSize(12),
    color: AllColors.white,
    fontWeight: "bold",
    fontFamily: Fonts.AfacadRegular,
  },
  contact: {
    fontSize: fontSize(12),
    color: AllColors.subText,
    top: 1,
    marginVertical: metrics.smallMargin,
    fontFamily: Fonts.AfacadRegular,
  },
  email: {
    fontSize: fontSize(12),
    color: AllColors.subText,
    fontFamily: Fonts.AfacadRegular,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row", // Ensures icon and text align horizontally
    alignItems: "center",
  },
  editContent: {
    flexDirection: "row", // Align icon and text in a horizontal line
    alignItems: "center", // Center align vertically
  },
  editIconWrapper: {
    marginRight: 6, // Spacing between icon and text
  },
  editIcon: {
    width: 12, // Icon width
    height: 12, // Icon height
  },
  editText: {
    fontSize: 12,
    color: AllColors.white,
    fontWeight: "600",
  },

  section: {
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AllColors.lightBlack,
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40, // Adjust to fit your layout
  },
  menuTitle: {
    fontSize: 16,
    color: AllColors.white,
    fontWeight: 500,
    fontFamily: Fonts.AfacadBold,
  },
  menuSubtitle: {
    fontSize: 14,
    color: AllColors.subText,
    fontFamily: Fonts.AfacadRegular,
  },
  arrow: {
    fontSize: 18,
    color: AllColors.white,
  },
});
