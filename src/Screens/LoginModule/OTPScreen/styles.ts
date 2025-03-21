import { Dimensions, Platform, StyleSheet } from 'react-native';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts, fontSize } from '../../../Constants/Fonts';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  mailImage: {
    width: '30%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: metrics.hp9,
    marginTop: Platform.OS == 'android' ? metrics.hp3 : metrics.hp3,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 30,
    color: AllColors.black,
    marginTop: metrics.hp5,
    lineHeight: 40,
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 18,
    color: AllColors.subText,
    marginTop: metrics.hp0_5,
  },
  phoneNumberText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 18,
    color: AllColors.black,
    marginTop: metrics.hp5,
  },
  textInputView: {
    height: metrics.hp6,
    width: '80%',
    backgroundColor: AllColors.textInput,
    borderRadius: metrics.hp1,
    left: 5,
    paddingLeft: 11,
    fontSize: 14,
    color: AllColors.white,
    fontFamily: Fonts.AfacadBold,
  },
  marginView: {
    marginHorizontal: metrics.hp2,
    marginBottom: Platform.OS == 'android' ? 0 : 150,
    flex: 1,
  },
  viewOtpinput: { paddingBottom: metrics.hp3 },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: '7%',
  },
  textInput: {
    width: metrics.hp5_5,
    height: metrics.hp6,
    borderWidth: 0.5,
    borderColor: AllColors.lightGray,
    fontFamily: Fonts.AfacadBold,
    fontSize: fontSize(14),
    color: AllColors.black,
    borderRadius: metrics.hp1,
    backgroundColor: AllColors.lightGray,
    paddingLeft: metrics.hp3_5 + 2,
  },
  textError: {
    fontSize: fontSize(12),
    color: AllColors.red,
    fontFamily: Fonts.AfacadRegular,
    textAlign: 'left',
    marginTop: metrics.hp1_5,
  },
  otpText: {
    width: '100%',
    alignSelf: 'center',
    fontFamily: Fonts.AfacadRegular,
    fontSize: 18,
    color: AllColors.subText,
    marginTop: metrics.hp0_5,
  },
  otpTextWhite: {
    width: metrics.hp25 + metrics.hp2,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.AfacadBold,
    fontSize: 18,
    color: AllColors.white,
    marginTop: metrics.hp0_5,
  },
});
