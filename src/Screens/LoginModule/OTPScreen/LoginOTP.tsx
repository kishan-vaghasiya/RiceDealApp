import { CommonActions, NavigationProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Keyboard, SafeAreaView, Text, TouchableWithoutFeedback, View, Animated, TouchableOpacity } from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpInput from '../../../Components/otpInput/OtpInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';

interface LoginScreenProps {
  route: { params: Mnumber };
  navigation: NavigationProp<any, any>;
}
type Mnumber = {
  CountryCode: string;
  Number: string;
};

const LoginOTP = (props: LoginScreenProps) => {
  const route = useRoute<any>();
  console.log("sessionId", route?.params?.sessionId,)
  console.log("otpString", route?.params?.otpString,)
  console.log("mobile", route?.params?.mobile,)

  const isFirst = route?.params?.isfirst

  const [otp, setOtp] = useState<string>('');
  console.log("OTP entered: ", otp);
  const [otpCodeHasError, setOtpCodeHasError] = useState<boolean>(false);
  const [otpCodeErrorString, setOtpCodeErrorString] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(30);
    setIsRunning(true);
  };

  useEffect(() => {
    startTimer();
  }, []);

  async function onConfirm(otp: string) {
    const otpString = otp?.join('');

    const otpRegex = /^\d{6}$/;

    if (otpRegex.test(otpString)) {
      try {
        const response = await Instance.post(`/v1/users/verify/otp`, { sessionId: route?.params?.sessionId, otp: otpString, mobile: route?.params?.mobile, isFirst });

        
        if (response?.data?.token) {
          await AsyncStorage.setItem('userToken', response?.data?.token);
          if (response?.data?.isFirst) {
            props.navigation.navigate("CompleteProfile", { user: response?.data?.result })
          } else {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 3,
                routes: [{ name: 'TabNavigator' }],
              }),
            );
          }
        } else {
          setOtpCodeErrorString(response?.data?.msg || "Something went wrong");
          setOtpCodeHasError(true);
        }
      } catch (error: any) {
        console.error("API Error: ", error);
        console.log("error: ", error?.response?.data);
        setToastMessage(error?.response?.data?.msg || "Something went wrong");
        setOtpCodeErrorString(error?.response?.data?.msg || "Something went wrong");
        setToastType('error');
        // setOtpCodeErrorString('There was an error verifying the OTP');
        setOtpCodeHasError(true);
      }
    } else {
      setToastMessage('OTP must be 6 digits.');
      setOtpCodeErrorString('OTP must be 6 digits.');
      setToastType('error');
      setOtpCodeHasError(true);
    }
  }



  return (
    <ImageBackground style={styles.container}>
      <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={0} enableAutomaticScroll={true} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View>
            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.mobilephone} />
            <Text style={styles.phoneText}>{`Enter OTP sent to \n${props?.route?.params?.CountryCode} ${props?.route?.params?.Number}`}</Text>
            <Text style={styles.phoneSubText}>{'We will send you a confirmation code'}</Text>
            <Text style={styles.phoneNumberText}>{'Verification Code'}</Text>

            <View style={{ marginTop: 20 }}>
              <OtpInput otp={otp} setOtp={setOtp} />
            </View>

            <View style={styles.viewOtpinput}>
              {otpCodeHasError && (
                <View>
                  <Text style={styles.textError}>{otpCodeErrorString}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={() => onConfirm(otp)}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>

        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <ToastMessage type={toastType} message={toastMessage} />
    </ImageBackground>
  );
};

export default LoginOTP;
