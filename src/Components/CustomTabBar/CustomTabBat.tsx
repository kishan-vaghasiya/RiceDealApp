import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {TabActions} from '@react-navigation/native';
import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import {Images} from '../../Assets/Images';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {AllColors} from '../../Constants/COLORS';

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  // Animation values for each tab
  const scaleValues = state.routes.map(() => new Animated.Value(1));
  const opacityValues = state.routes.map(() => new Animated.Value(1));

  const onPress = (route: string, index: number) => {
    const jumpToAction = TabActions.jumpTo(route, {});
    navigation.dispatch(jumpToAction);

    // Animate the pressed tab
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValues[index], {
          toValue: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValues[index], {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleValues[index], {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValues[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const getIcon = (route: string, isFocused: boolean, index: number) => {
    const iconColor = isFocused ? AllColors.primary900 : AllColors.grey;
    const bgColor = isFocused ? 'rgba(106, 98, 222, 0.1)' : 'transparent';

    let iconSource;
    switch (route) {
      case 'Home':
        iconSource = Images.home;
        break;
      case 'Chat':
        iconSource = Images.chat;
        break;
      case 'Profile':
        iconSource = Images.profile;
        break;
      default:
        iconSource = Images.portfolio;
    }

    return (
      <Animated.View
        style={[
          styles.tabContainer,
          {
            transform: [{scale: scaleValues[index]}],
            opacity: opacityValues[index],
          },
        ]}>
        <TouchableOpacity
          style={[styles.touchTabBtn, {backgroundColor: bgColor}]}
          onPress={() => onPress(route, index)}
          activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Image
              source={iconSource}
              style={styles.tabImage}
              tintColor={iconColor}
            />
            {route === 'Chat' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabBarLable,
              {
                color: isFocused ? AllColors.primary900 : AllColors.grey,
              },
            ]}>
            {route}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subView}>
        <View style={styles.tabBarBackground}>
          <View style={styles.tabBarInner}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              return (
                <View style={styles.tabButtonContainer} key={index}>
                  {getIcon(route.name, isFocused, index)}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  subView: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  tabBarBackground: {
    backgroundColor: AllColors.white,
    borderRadius: 24,
    height: Platform.OS === 'ios' ? 82 : 72,
    shadowColor: AllColors.black,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchTabBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    height: '100%',
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
  },
  tabImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  tabBarLable: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: Platform.OS === 'ios' ? fontSize(9) : fontSize(10),
    // fontFamily: Fonts.AfacadSemiBold,
    includeFontPadding: false,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AllColors.white,
  },
  badgeText: {
    color: AllColors.white,
    fontSize: fontSize(8),
    fontFamily: Fonts.AfacadBold,
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default CustomTabBar;