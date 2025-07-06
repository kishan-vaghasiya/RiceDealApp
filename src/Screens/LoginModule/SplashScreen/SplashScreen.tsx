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
import { 
  Image, 
  Animated, 
  Easing, 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SplashScreenProps {
  navigation: NavigationProp<any, any>;
}

const SplashScreen = (props: SplashScreenProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ]).start();

    const checkUserAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        
        setTimeout(() => {
          if (userToken) {
            props.navigation.replace('TabNavigator');
          } else {
            props.navigation.replace('LoginScreen');
          }
        }, 2500); // Match animation duration

      } catch (error) {
        console.error('Error checking auth status:', error);
        props.navigation.replace('LoginScreen');
      }
    };

    checkUserAuth();
  }, [props.navigation, fadeAnim, scaleAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            style={styles.logo}
            source={require('../../../Assets/Image/Login/Logo.jpg')}
          />
        </Animated.View>
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Welcome to Our App</Text>
          <Text style={styles.subtitle}>Loading your experience...</Text>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, {
            width: progressWidth
          }]} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c669f', // Fallback solid color
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  loadingContainer: {
    height: 5,
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginTop: 40,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default SplashScreen;