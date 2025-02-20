import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import style from "./style";

// import { MenuItem, MenuDivider, Menu } from 'react-native-material-menu';
import LinearGradient from "react-native-linear-gradient";
import metrics from "../../Constants/Metrics";
import { Fonts, fontSize } from "../../Constants/Fonts";
import { Images } from "../../Assets/Images";
import { AllColors } from "../../Constants/COLORS";

export type props = {
  showSearch?: boolean;
  screenName?: string;
  type: string;
  profilePicUrl?: string;
  customImage?: any;
  onPressProfilePic?: ((event: GestureResponderEvent) => void) | undefined;
  onPressBell?: ((event: GestureResponderEvent) => void) | undefined;
  dotsMenu?: boolean;
  showbackIcon?: boolean;
  showNotification?: boolean;
  userName?: string;
  onPressdotsMenu?: ((event: GestureResponderEvent) => void) | undefined;
  onPressBack?: ((event: GestureResponderEvent) => void) | undefined;
  openDrawer?: ((event: GestureResponderEvent) => void) | undefined;
  onPresRefer?: ((event: GestureResponderEvent) => void) | undefined;
  onPressSearchIcon?: ((event: GestureResponderEvent) => void) | undefined;
  onPressNotificationIcon?:
    | ((event: GestureResponderEvent) => void)
    | undefined;
  onPressPlus?: ((event: GestureResponderEvent) => void) | undefined;
};

export const CustomHeader: React.FC<props> = ({
  showSearch,
  type,
  screenName,
  showNotification,
  showbackIcon,
  onPressdotsMenu,
  onPressBack,
  userName,
  profilePicUrl,
  onPressProfilePic,
  onPressSearchIcon,
  onPressNotificationIcon,
  customImage,
}) => {
  return (
    <View style={[style.container, { zIndex: 10 }]}>
      {type === "invest" ? (
        <View style={style.investHeaderView}>
          <View style={style.searchMainView}>
          {screenName && <Text style={style.screenText}>{screenName}</Text>}
          </View>
          <View style={style.investSubHeader}>
            <TouchableOpacity onPress={onPressProfilePic}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ImageBackground
             source={Images.roundBackgorundBlur}
             style={style.profileBackground}
             imageStyle={style.bacgroundImage} 
             resizeMode="cover"  
             >
             <Image
             source={Images.Logo}
             resizeMode="contain"
             style={style.profileImage}  
             />
             </ImageBackground>
           </View>
           </TouchableOpacity> 
          
          </View>
        </View>
      ) : type === "back" ? (
        <View style={style.viewRow}>
          <View style={style.backWithMenu}>
            <View style={style.viewRow}>
              {!showbackIcon && (
                <TouchableOpacity style={style.touchBack} onPress={onPressBack}>
                  <Image
                    source={Images.BackButton}
                    style={{ height: metrics.hp4, width: metrics.hp4 }}
                  />
                </TouchableOpacity>
              )}
              {screenName && (
                <Text
                  style={[
                    style.screenText,
                    { left: showSearch ? metrics.hp3_5 : metrics.hp2 },
                  ]}
                >
                  {screenName}
                </Text>
              )}
            </View>
            {showSearch && (
              <Image
                source={customImage}
                style={{
                  height: metrics.hp4,
                  width: metrics.hp4,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />
            )}

            {showNotification && (
              <TouchableOpacity
                style={[style.touchDots, { marginRight: metrics.hp2 }]}
                onPress={onPressdotsMenu}
              >
                <Image
                  source={Images.notificationIcon}
                  style={{ height: metrics.hp3, width: metrics.hp3 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : type === "Details" ? (
        <View style={style.viewRow}>
          <View style={style.backWithMenu}>
            <View style={style.viewRow}>
              <TouchableOpacity style={style.touchBack} onPress={onPressBack}>
                <Image
                  source={Images.arrowLeft}
                  style={{ height: metrics.hp3, width: metrics.hp3 }}
                />
              </TouchableOpacity>
              {screenName && <Text style={style.screenText}>{screenName}</Text>}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};
