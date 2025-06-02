import { Dimensions, Platform, StyleSheet } from 'react-native';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts, fontSize } from '../../../Constants/Fonts';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: AllColors.white,
    elevation: 10,
    paddingVertical: 15,
  },
  headerText: {
    color: AllColors.black,
    fontSize: 22,
    marginHorizontal: 15,
    fontFamily: Fonts.AfacadBold
  },
  profileContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: AllColors.white,
    elevation: 5,
    borderRadius: 5,
    padding: 15,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: metrics.hp9,
    height: metrics.hp9,
    borderRadius: 100
  },
  profileDetails: {
    marginRight: 28,
    marginTop: 5
  },
  profileDetailRow: {
    flexDirection: 'row',
    marginTop: 5
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: Fonts.AfacadBold
  },
  name: {
    fontSize: 18,
    color: AllColors.text300,
    fontFamily: Fonts.AfacadMedium
  },
  addItemImage: {
    width: metrics.hp4,
    height: metrics.hp4,
    top: 20,
    right: 8
  },
  commonChangableView: {
    marginTop: 10,
  },
  itemContainer: {
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: AllColors.white,
    borderRadius: 5,
    padding: metrics.hp2,
    elevation: 5,
    shadowColor: AllColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemImage: {
    width: 325,
    alignSelf: 'center',
    height: 150,
    borderRadius: 10
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginTop: metrics.hp2,
  },
  itemTitle: {
    fontSize: fontSize(16),
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold
  },
  itemSubtitle: {
    fontSize: fontSize(14),
    fontFamily: Fonts.AfacadBold
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: fontSize(17),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary900,
  },
  ItemViewHistory: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: metrics.hp1,
    marginRight: metrics.hp2,
  },
  binImage: {
    width: metrics.hp3,
    height: metrics.hp3,
    marginLeft: 15,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 100,
    left: 15,
    right: 15,
    backgroundColor: AllColors.primary900,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PlanChooseButton: {
    position: 'absolute',
    bottom: 200,
    left: 15,
    right: 15,
    backgroundColor: AllColors.primary900,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: AllColors.white,
    fontSize: 18,
    fontFamily: Fonts.AfacadBold
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

});
