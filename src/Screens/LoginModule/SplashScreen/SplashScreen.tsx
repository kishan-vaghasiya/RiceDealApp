// import { CommonActions, NavigationProp } from "@react-navigation/native";
// import React, { useState,useEffect } from "react";
// import { Image, ImageBackground } from "react-native";
// import { Images } from "../../../Assets/Images";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { styles } from "./styles";
// import { MMKV } from "react-native-mmkv";

// interface SplashScreenProps {
//   // route: { params: { changeSignInStatus: (flag: boolean) => void } }
//   navigation: NavigationProp<any, any>;
// }

// const SplashScreen = (props: SplashScreenProps) => {
//   useEffect(() => {
//     setTimeout(() => {
//       props.navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{ name: "LoginScreen" }],
//         })
//       );
//     }, 2000);
//   }, []);

//   return (
//     <ImageBackground
//       style={styles.container}
//     >
//       <SafeAreaView>
//         <Image style={styles.SplashScreen} source={{uri : 'https://www.eatthis.com/wp-content/uploads/sites/4/media/images/ext/989072325/white-rice-uncooked.jpg?quality=82&strip=all&w=640'}} />
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// export default SplashScreen;


import { CommonActions, NavigationProp } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "./styles";

interface SplashScreenProps {
  navigation: NavigationProp<any, any>;
}

const SplashScreen = (props: SplashScreenProps) => {
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        // console.log('Token:', userToken);

        setTimeout(() => {
          if (userToken) {
            props.navigation.replace('TabNavigator');
          } else {
            props.navigation.replace('LoginScreen');
          }
        }, 1000);

      } catch (error) {
        console.error('Error checking auth status:', error);
        props.navigation.replace('LoginScreen');
      }
    };

    checkUserAuth();
  }, [props.navigation]); // Dependency array to ensure this effect only runs once

  return (
    <ImageBackground style={styles.container}>
      <SafeAreaView>
        <Image
          style={styles.SplashScreen}
          // source={{ uri: 'https://www.eatthis.com/wp-content/uploads/sites/4/media/images/ext/989072325/white-rice-uncooked.jpg?quality=82&strip=all&w=640' }}
          source={require('../../../Assets/Image/Login/carouselDealRice.jpg')}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SplashScreen;
