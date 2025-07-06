import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../../Assets/Images';

interface LoginScreenProps {
  navigation: NavigationProp<any, any>;
}

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#4361EE',
  primaryLight: '#E7EBFD',
  primary300: '#A5B4FC',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#64748B',
  grayLight: '#E2E8F0',
  grayDark: '#334155',
  success: '#4ADE80',
  error: '#F75555',
};

const LoginScreen = (props: LoginScreenProps) => {
  const navigation = useNavigation<any>();
  const [fcmToken, setFcmToken] = useState<any>('');
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    getFCMToken();
  }, []);

  const getFCMToken = async () => {
    let token = await messaging().getToken();
    setFcmToken(token);
    console.log(token, 'my token');
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <LinearGradient colors={['#E7EBFD', '#FFFFFF']} style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 0 : 40}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.logoContainer,
                { opacity, transform: [{ translateY }] },
              ]}
            >
              <Image
                style={styles.logo}
                resizeMode="contain"
                source={Images.Logo}
              />
            </Animated.View>

            <Animated.View style={[styles.headerContainer, { opacity }]}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Choose your login method</Text>
            </Animated.View>

            <Animated.View style={[styles.buttonContainer, { opacity }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EmailLogin')}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Login with Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('MobileOTP')}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Login with OTP</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity }]}>
              <Text style={styles.footerText}>
                Don't have an Account?{' '}
                <Text
                  style={styles.signupText}
                  onPress={() =>
                    props.navigation.navigate('AboutProfileScreen')
                  }
                >
                  Sign up
                </Text>
              </Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
    height: height * 0.25,
    marginBottom: height * 0.04,
  },
  logo: {
    width: width * 0.6,
    height: '100%',
  },
  headerContainer: {
    marginBottom: height * 0.05,
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: Colors.grayDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: Colors.gray,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: height * 0.03,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary300,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  footer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.gray,
    fontSize: width * 0.038,
  },
  signupText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
