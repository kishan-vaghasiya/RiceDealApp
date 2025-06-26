import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Dimensions,
  Image, 
  Keyboard, 
  Platform, 
  StyleSheet,
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View, 
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Instance } from '../../../Api/Instance';
import { LOGIN } from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import InputField from '../../../Components/CustomInput/InputField';
import { Images } from '../../../Assets/Images';
import LinearGradient from 'react-native-linear-gradient';

// Enhanced Color Constants
const Colors = {
  // Primary
  primary: '#4361EE',
  primaryDark: '#3A56D4',
  primaryLight: '#E7EBFD',
  primary300: '#A5B4FC',
  
  // Gradient Colors
  gradientStart: '#4361EE',
  gradientEnd: '#3A0CA3',
  
  // Status
  success: '#4ADE80',
  error: '#F75555',
  warning: '#FACC15',
  info: '#246BFD',
  
  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  
  // Additional
  overlay: 'rgba(0,0,0,0.5)',
};

interface LoginDetailsProps {
  route: { params: { Type: string } };
  navigation: NavigationProp<any, any>;
}

const { width, height } = Dimensions.get('window');

const LoginWithMobile = (props: LoginDetailsProps) => {
  const [userEmail, setuserEmail] = useState<string>('');
  const [userPass, setuserPass] = useState<string>('');
  const [fcmToken, setFcmToken] = useState<any>('');
  const [isEmailSign] = useState<string>(props?.route?.params?.Type);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getFCMToken = async () => {
    let token = await messaging().getToken();
    setFcmToken(token);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignin = async () => {
    Keyboard.dismiss();
    
    if (!userEmail || !userPass) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    
    if (!validateEmail(userEmail)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await Instance.post(LOGIN.url, { 
        email: userEmail, 
        password: userPass, 
        fcmToken: fcmToken 
      });

      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.token);
        setToastMessage('Login successful');
        setToastType('success');
        props.navigation.navigate('TabNavigator');
      } else {
        setErrorMessage(response.data.msg || 'Login failed');
        setToastMessage(response.data.msg || 'Login failed');
        setToastType('error');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
      setToastMessage(errorMsg);
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    props.navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    props.navigation.navigate('ForgotPassword');
  };

  const navigateToPhoneLogin = () => {
    props.navigation.navigate('MobileOTP');
  };

  useEffect(() => {
    getFCMToken();
  }, []);

  return (
    <LinearGradient 
      colors={[Colors.gray50, Colors.white]}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 0 : 40}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {!isKeyboardVisible && (
              <View style={styles.logoContainer}>
                <Animated.Image 
                  style={styles.logo} 
                  resizeMode="contain"
                  source={Images.Logo} 
                  sharedTransitionTag="appLogo"
                />
                <View style={styles.logoBackground} />
              </View>
            )}

            <View style={styles.headerContainer}>
              <Text style={styles.header}>Welcome Back</Text>
              <Text style={styles.subHeader}>Sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
              <InputField
                label="Email Address"
                placeholder="example@email.com"
                value={userEmail}
                onChangeText={setuserEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
                containerStyle={styles.inputContainer}
              />

              <InputField
                label="Password"
                placeholder="••••••••"
                value={userPass}
                onChangeText={setuserPass}
                secureTextEntry
                icon="lock-closed-outline"
                containerStyle={styles.inputContainer}
              />

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <TouchableOpacity 
                onPress={navigateToForgotPassword}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleSignin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={navigateToPhoneLogin}
                style={styles.secondaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue with Phone</Text>
              </TouchableOpacity>
            </View>

            {!isKeyboardVisible && (
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={navigateToSignUp}>
                  <Text style={styles.footerLink}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      
      <ToastMessage 
        type={toastType} 
        message={toastMessage} 
        onDismiss={() => setToastMessage('')}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
    position: 'relative',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    zIndex: 2,
  },
  logoBackground: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: Colors.primaryLight,
    opacity: 0.3,
    top: -width * 0.05,
  },
  headerContainer: {
    marginBottom: height * 0.05,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGroup: {
    marginTop: height * 0.02,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: Colors.gray300,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: Colors.gray800,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.gray500,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  footerText: {
    color: Colors.gray500,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginWithMobile;