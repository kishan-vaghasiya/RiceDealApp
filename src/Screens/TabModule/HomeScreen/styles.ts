import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts} from '../../../Constants/Fonts';
const { width } = Dimensions.get('window');

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
  productList: {padding: 10},
  productContainer: {marginRight: 15, alignItems: 'center'},
  productImage: {width: 100, height: 100, borderRadius: 10},
  productName: {fontSize: 14, textAlign: 'center',fontFamily:Fonts.AfacadSemibold},
  productCode: {fontSize: 13, color: '#666',fontFamily:Fonts.AfacadMedium},
  banner: {
    width: width - 20,
    height: 150,
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200, 
  },
  sectionTitle: {fontSize: 20, marginLeft: 15, marginVertical: 10,fontWeight:'600',fontFamily:Fonts.AfacadBold},
  categoryList: {justifyContent: 'space-around', marginBottom: 10},
  categoryCard: {width: width / 2 - 5, marginBottom: 7, alignItems: 'center'},
  categoryImage: {width: width / 2 - 30, height: 100, borderRadius: 8},
  categoryText: {fontSize: 18, marginTop: 5,fontFamily:Fonts.AfacadMedium},
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#00bfa5',
  },
  navButton: {alignItems: 'center'},
});
