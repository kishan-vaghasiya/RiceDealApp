import { Platform, StyleSheet } from "react-native";
import { AllColors } from "../../../Constants/COLORS";
import { Fonts } from "../../../Constants/Fonts";
import metrics from "../../../Constants/Metrics";

export const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
    width: "100%",
    backgroundColor: AllColors.white,
  },
  marginView: {
    marginBottom: Platform.OS == "android" ? 0 : 0,
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: AllColors.appDarkBackGround,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: metrics.hp3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AllColors.white,
  },
  editPhotoButton: {
    marginTop: 0,
  },
  editPhotoText: {
    color: AllColors.white,
    fontSize: 14,
  },
  saveButton: {
    height: metrics.hp6,
    backgroundColor: AllColors.primary300,
    marginHorizontal: 15,
    justifyContent: 'center',
    marginTop: metrics.hp1,
    borderRadius: metrics.hp2,
    marginBottom: metrics.hp2,  
  },
  saveButtonText: {
    color: AllColors.black,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Fonts.AfacadRegular,
  },
});
