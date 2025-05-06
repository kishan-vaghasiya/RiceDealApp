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
  modalOverlay: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    height: '100%'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    width: '50%'
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  }

});
