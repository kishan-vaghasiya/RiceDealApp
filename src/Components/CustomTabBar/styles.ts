// import {Platform, StyleSheet} from 'react-native';
// import {AllColors} from '../../Constants/COLORS';
// import {Fonts, fontSize} from '../../Constants/Fonts';
// import metrics from '../../Constants/Metrics';

// export default StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     height: 0,
//     width: '100%',
//     marginLeft: Platform.OS == 'android' ? 1 : 0,
//   },
//   tabBatButtonContainer: {
//     width: '33%',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   subView: {
//     height: '100%',
//     width: '100%',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   touchTabBtn: {
//     alignItems: 'center',
//     height: '100%',
//     width: '90%',
//     left: 5,
//     marginBottom: metrics.hp1_7,
//     alignSelf: 'center',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   tabBarLable: {
//     fontSize: fontSize(10),
//     top: metrics.hp1,
//     fontFamily: Fonts.AfacadRegular,
//   },
//   viewRow: {
//     flexDirection: 'row',
//     height: metrics.hp7 + metrics.hp0_5,
//     width: '100%',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     left: 0,
//   },
//   viewShadow: {padding: 4, borderRadius: 30},
//   MgpImageContainer: {
//     borderRadius: metrics.hp4,
//     bottom: metrics.hp5,
//     position: 'absolute',
//     alignSelf: 'center',
//   },
//   MgpImage: {height: metrics.hp10, width: metrics.hp10, right: metrics.hp0_6},
//   tabImage: {height: metrics.hp3, width: metrics.hp3},
//   imageTabBg: {
//     height: metrics.hp10,
//     width: '95%',
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//     bottom: 7,
//     left: '2%',
//     right: 0,
//     borderWidth: 1,
//     borderColor: AllColors.textInput,
//     borderRadius: metrics.hp6,
//   },
// });
import {Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import {Fonts, fontSize} from '../../Constants/Fonts';
import metrics from '../../Constants/Metrics';

export const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   elevation: 0,
  //   backgroundColor: 'transparent',
  // },
  subView: {
    height: 80,
    backgroundColor: 'transparent',
  },
  imageTabBg: {
    flex: 1,
    backgroundColor: AllColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: AllColors.black,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBatButtonContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchTabBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingVertical: 8,
  },
  activeTab: {
    // Additional styles for active tab if needed
  },
  tabImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tabBarLable: {
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AllColors.primary900,
  },
});