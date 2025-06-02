import * as React from "react";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Animated, Easing, View } from "react-native";
import { _navigationRef } from "./navigationRef";
import LoginScreen from "../Screens/LoginModule/LoginScreen/LoginScreen";
import SplashScreen from "../Screens/LoginModule/SplashScreen/SplashScreen";
import LoginOTP from "../Screens/LoginModule/OTPScreen/LoginOTP";
import { BottomTabBarProps, createBottomTabNavigator, } from "@react-navigation/bottom-tabs";
import ContactLists from "../Screens/TabModule/InvestScreen/ContactLists";
import ProfileScreen from "../Screens/TabModule/AINFYScreen/ProfileScreen";
import CustomTabBar from "../Components/CustomTabBar/CustomTabBat";
import HomeScreen from "../Screens/TabModule/HomeScreen/HomeScreen";
import EditProfile from "../Screens/ProfileModule/EditProfile/EditProfileScreen";
import LoginDetails from "../Screens/LoginModule/LoginDetails/LoginDetails";
import AboutProfileScreen from "../Screens/LoginModule/AboutProfile/AboutProfileScreen";
import ChatScreen from "../Screens/TabModule/ChatScreen/ChatScreen";
import AddItem from "../Screens/ProfileModule/AddItem/AddItem";
// import RiseListDetails from "../Screens/TabModule/RiseListScreen/RiseListDetails";
import RiseListScreen from "../Screens/TabModule/RiseListScreen/RiseListScreen";
import DealPostList from "../Screens/TabModule/DealPostList/DealPostList";
import DealChat from "../Screens/TabModule/DealPostList/DealChat";
import ChoosePlan from "../Screens/TabModule/ChoosePlan/ChoosePlan";
import MobileOTP from "../Screens/LoginModule/LoginScreen/MobileOTP";
// import EmailLogin from "../Screens/LoginModule/LoginScreen/EmailLogin";
import RiseListChat from "../Screens/TabModule/RiseListScreen/RiseListChat";
import Subscribed from "../Screens/TabModule/ChoosePlan/Subscribed";
import LoginWithMobile from "../Screens/LoginModule/LoginScreen/LoginWithMobile";
import ForgotPassword from "../Screens/LoginModule/ForgotPassword/ForgotPassword";
import EmailLogin from "../Screens/LoginModule/LoginDetails/EmailLogin";
import ProfileComplete from "../Screens/LoginModule/LoginDetails/ProfileComplete";
import ChatScreenWithCategory from "../Screens/TabModule/ChatScreen/ChatScreenWithCategory";
import ConcatctListWithCategory from "../Screens/TabModule/InvestScreen/ConcatctListWithCategory";
import { createNotificationChannel, requestUserPermission } from "../Screens/utils/PushNotification";

const options2 = {
  headerShown: false,
  transitionSpec: {
    open: {
      animation: "timing", // Use timing for abrupt animation
      config: {
        duration: 0, // Set duration to 0 for an instant transition
      },
    },
    close: {
      animation: "timing", // Use timing for abrupt animation
      config: {
        duration: 0, // Set duration to 0 for an instant transition
      },
    },
  },
};

export default function Route() {
  const StackObj = createNativeStackNavigator();
  const TabObj = createBottomTabNavigator();

  const TabNavigator = () => {
    return (
      /* @ts-ignore */
      <TabObj.Navigator initialRouteName="Home" tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}>
        <TabObj.Screen name="Chat" component={ContactLists} options={{ headerShown: false }} />
        <TabObj.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <TabObj.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </TabObj.Navigator>
    );
  };

  /* React.useEffect(() => {
    requestUserPermission();
    createNotificationChannel();
  }, []) */

  return (
    <View style={{ flex: 1, }}>
      <NavigationContainer ref={_navigationRef}>
        <StackObj.Navigator screenOptions={{ autoHideHomeIndicator: true }}>
          <StackObj.Screen name={"SplashScreen"} component={SplashScreen} options={options2} />
          <StackObj.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
          <StackObj.Screen name="LoginDetails" component={LoginDetails} options={{ headerShown: false }} />
          <StackObj.Screen name={"LoginScreen"} component={LoginScreen} options={options2} />
          <StackObj.Screen name={"LoginWithMobile"} component={LoginWithMobile} options={options2} />
          <StackObj.Screen name={"EmailLogin"} component={EmailLogin} options={options2} />
          <StackObj.Screen name={"CompleteProfile"} component={ProfileComplete} options={options2} />

          <StackObj.Screen name={"ConcatctListWithCategory"} component={ConcatctListWithCategory} options={{ headerShown: false }} />

          <StackObj.Screen name={"EditProfile"} component={EditProfile} options={options2} />
          <StackObj.Screen name={"ChatScreen"} component={ChatScreen} options={options2} />
          <StackObj.Screen name={"ChatScreenWithCategory"} component={ChatScreenWithCategory} options={options2} />
          <StackObj.Screen name={"AboutProfileScreen"} component={AboutProfileScreen} options={options2} />
          <StackObj.Screen name={"AddItem"} component={AddItem} options={options2} />
          <StackObj.Screen name={"LoginOTP"} component={LoginOTP} options={options2} />
          <StackObj.Screen name={'RiseListScreen'} component={RiseListScreen} options={{ headerShown: false }} />
          <StackObj.Screen name='DealPostList' component={DealPostList} options={{ headerShown: false }} />
          <StackObj.Screen name='DealChat' component={DealChat} options={{ headerShown: false }} />
          <StackObj.Screen name='ChoosePlan' component={ChoosePlan} options={{ headerShown: false }} />
          <StackObj.Screen name='MobileOTP' component={MobileOTP} options={{ headerShown: false }} />
          <StackObj.Screen name='RiseListChat' component={RiseListChat} options={{ headerShown: false }} />
          <StackObj.Screen name='Subscribed' component={Subscribed} options={{ headerShown: false }} />
          <StackObj.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
        </StackObj.Navigator>
      </NavigationContainer>
    </View>
  );
}
