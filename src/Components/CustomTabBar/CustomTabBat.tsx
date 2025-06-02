import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabActions, } from "@react-navigation/native";
import React from "react";
import { Text, View, Image, TouchableOpacity, Platform, } from "react-native";
import styles from "./styles";
import { Images } from "../../Assets/Images";
import { Fonts, fontSize } from "../../Constants/Fonts";
import { AllColors } from "../../Constants/COLORS";

const CustomTabBar = ({ state, descriptors, navigation, }: BottomTabBarProps) => {
  const onPress = (route: string) => {
    const jumpToAction = TabActions.jumpTo(route, {});
    navigation.dispatch(jumpToAction);
  };

  const getIcon = (route: string, isFocused: boolean, index: number) => {
    return (
      <TouchableOpacity style={styles.touchTabBtn} onPress={() => onPress(route)}>
        {route === "Home" ? (
          isFocused ? (<Image source={Images.home} style={styles.tabImage} tintColor={AllColors.primary900} />) : (<Image source={Images.home} style={styles.tabImage} tintColor={AllColors.black} />)
        ) : route === "Chat" ? (
          isFocused ? (
            <Image source={Images.chat} style={styles.tabImage} tintColor={AllColors.primary900} />
          ) : (
            <Image source={Images.chat} style={styles.tabImage} tintColor={AllColors.black} />
          )
        ) : route === "Profile" ? (
          isFocused ? (
            <Image source={Images.profile} style={styles.tabImage} tintColor={AllColors.primary900} />
          ) : (
            <Image source={Images.profile} style={styles.tabImage} tintColor={AllColors.black} />
          )
        ) : (
          <Image source={Images.portfolio} style={styles.tabImage} />
        )}

        <Text style={[styles.tabBarLable, { fontSize: Platform.OS === "ios" ? fontSize(8) : fontSize(10), fontFamily: isFocused ? Fonts.AfacadSemibold : Fonts.AfacadRegular, color: isFocused ? AllColors.primary900 : "#8f8d97", },]}>{route}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subView}>
        <View style={styles.imageTabBg}>
          <View style={styles.viewRow}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              return (
                <View style={styles.tabBatButtonContainer} key={index}>
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

export default CustomTabBar;
