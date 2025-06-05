import {Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import {Fonts, fontSize} from '../../Constants/Fonts';
import metrics from '../../Constants/Metrics';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 0,
    width: '100%',
    marginLeft: Platform.OS == 'android' ? 1 : 0,
  },
  tabBatButtonContainer: {
    width: '33%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  touchTabBtn: {
    alignItems: 'center',
    height: '100%',
    width: '90%',
    left: 5,
    marginBottom: metrics.hp1_7,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabBarLable: {
    fontSize: fontSize(10),
    top: metrics.hp1,
    fontFamily: Fonts.AfacadRegular,
  },
  viewRow: {
    flexDirection: 'row',
    height: metrics.hp7 + metrics.hp0_5,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  viewShadow: {padding: 4, borderRadius: 30},
  MgpImageContainer: {
    borderRadius: metrics.hp4,
    bottom: metrics.hp5,
    position: 'absolute',
    alignSelf: 'center',
  },
  MgpImage: {height: metrics.hp10, width: metrics.hp10, right: metrics.hp0_6},
  tabImage: {height: metrics.hp3, width: metrics.hp3},
  imageTabBg: {
    height: metrics.hp10,
    width: '95%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 7,
    left: '2%',
    right: 0,
    borderWidth: 1,
    borderColor: AllColors.textInput,
    borderRadius: metrics.hp6,
  },
});
