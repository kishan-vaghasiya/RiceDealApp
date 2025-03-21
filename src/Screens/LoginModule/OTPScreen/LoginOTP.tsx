import { CommonActions, NavigationProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Keyboard, SafeAreaView, Text, TouchableWithoutFeedback, View,Animated, TouchableOpacity } from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpInput from '../../../Components/otpInput/OtpInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  console.log("sessionId",route?.params?.sessionId,)
  console.log("otpString",route?.params?.otpString,)
  console.log("mobile",route?.params?.mobile,)

  const [otp, setOtp] = useState<string>(''); 
  console.log("OTP entered: ", otp); 
  const [otpCodeHasError, setOtpCodeHasError] = useState<boolean>(false);
  const [otpCodeErrorString, setOtpCodeErrorString] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

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
    const otpString = otp.join(''); 
    
    const otpRegex = /^\d{6}$/; 
    
    if (otpRegex.test(otpString)) {
      try {
        const response = await Instance.post(`/v1/users/verify/otp`, {
          sessionId: route?.params?.sessionId,
          otp: otpString,
          mobile: route?.params?.mobile,
        });
        console.log("API Response: ", response);  
  
        if (response?.data?.token) {
          await AsyncStorage.setItem('userToken', response?.data?.token);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 3,
              routes: [{ name: 'TabNavigator' }],
            }),
          );
        } else {
          setOtpCodeErrorString(response?.data?.msg || "Something went wrong");
          setOtpCodeHasError(true);
        }
      } catch (error) {
        console.error("API Error: ", error); 
        setOtpCodeErrorString('There was an error verifying the OTP');
        setOtpCodeHasError(true);
      }
    } else {
      setOtpCodeErrorString('OTP must be 6 digits.');
      setOtpCodeHasError(true);
    }
  }
  
  

  return (
    <ImageBackground style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={0} enableAutomaticScroll={true} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View>
            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.mobilephone} />
            <Text style={styles.phoneText}>{`Enter OTP sent to \n${props?.route?.params?.CountryCode} ${props?.route?.params?.Number}`}</Text>
            <Text style={styles.phoneSubText}>{'We will send you a confirmation code'}</Text>
            <Text style={styles.phoneNumberText}>{'Verification Code'}</Text>

           <View style={{marginTop:20}}>
           <OtpInput otp={otp} setOtp={setOtp} />
           </View>

            <View style={styles.viewOtpinput}>
              {otpCodeHasError && (
                <View>
                  <Text style={styles.textError}>{otpCodeErrorString}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
          style={styles.submitButton}
       onPress={() => onConfirm(otp)} 
             >
  <Text style={styles.submitButtonText}>Submit</Text>
</TouchableOpacity>
    
          </View>
       
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default LoginOTP;
