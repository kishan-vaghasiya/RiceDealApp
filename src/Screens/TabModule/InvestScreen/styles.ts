import { Dimensions, Platform, StyleSheet } from 'react-native';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts } from '../../../Constants/Fonts';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
    marginHorizontal: metrics.hp2,
    alignSelf: 'center',
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  list: {
    paddingVertical: 10,
    marginTop: metrics.hp1,
    marginHorizontal: metrics.hp1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    // Shadow for Android
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#000',
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'red',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
