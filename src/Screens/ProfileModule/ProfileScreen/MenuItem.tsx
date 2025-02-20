import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './style';
import { Images } from '../../../Assets/Images';

type MenuItemProps = {
  title: string;
  subtitle?: string;
  iconName: any;
  onPress: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ title, subtitle, iconName, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconAndText}>
        {/* Animated Icon */}
        <Animated.View style={styles.iconWrapper}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={iconName}
            height={36}
            width={36}
          />
        </Animated.View>

        {/* Text Section */}
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Right Arrow */}
      <Animated.View>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={Images.rightArrow}
            height={36}
            width={36}
          />
        </Animated.View>
    </TouchableOpacity>
  );
};


export default MenuItem;
