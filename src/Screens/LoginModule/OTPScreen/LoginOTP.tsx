import { CommonActions, NavigationProp, useRoute } from '@react-navigation/native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { Images } from '../../../Assets/Images';
import { AllColors } from '../../../Constants/COLORS';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import Animated from 'react-native-reanimated';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  route: { params: Mnumber };
  navigation: NavigationProp<any, any>;
}
type Mnumber = {
  CountryCode: string;
  Number: string;
};

interface inputRef extends RefObject<inputRef> {
  focus: () => void;
}

const LoginOTP = (props: LoginScreenProps) => {
  console.log(" ============================ loginOTP ========================= ");

  const route = useRoute<any>()
  // const { sessionId, mobile } = route?.params

  // console.log("data: ", sessionId);

  const [number, onChangeNumber] = useState('');
  const [isSelected, setIsSelected] = useState(Boolean);
  const [otpCodeHasError, setotpCodeHasError] = useState<boolean>(false);
  const [otpCodeErrorString, setotpCodeErrorString] = useState<string>('');

  const textInput0 = useRef<inputRef | undefined>(null);
  const textInput1 = useRef<inputRef | undefined>(null);
  const textInput2 = useRef<inputRef | undefined>(null);
  const textInput3 = useRef<inputRef | undefined>(null);
  const textInput4 = useRef<inputRef | undefined>(null);
  const textInput5 = useRef<inputRef | undefined>(null);
  const textInput6 = useRef<inputRef | undefined>(null);

  const [OTP1, setOTP1] = useState<string>('');
  const [OTP2, setOTP2] = useState<string>('');
  const [OTP3, setOTP3] = useState<string>('');
  const [OTP4, setOTP4] = useState<string>('');
  const [OTP5, setOTP5] = useState<string>('');
  const [OTP6, setOTP6] = useState<string>('');

  const [isFocus1, setIsFocused1] = useState<boolean>(false);
  const [isFocus2, setIsFocused2] = useState<boolean>(false);
  const [isFocus3, setIsFocused3] = useState<boolean>(false);
  const [isFocus4, setIsFocused4] = useState<boolean>(false);

  const [otps, setOtp] = useState('');

  const CELL_COUNT = 4; // Change to the desired OTP length
  const HASH_CODE = 'YOUR_HASH_CODE';

  const [timeLeft, setTimeLeft] = useState(30); // Starting value for the countdown
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    let timer: any;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1); // Decrease time by 1 second
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false); // Stop the timer when it reaches 0
    }

    return () => clearInterval(timer); // Clear the interval when component unmounts or timer resets
  }, [isRunning, timeLeft]);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setIsRunning(true);
  };

  async function onConfirm(otp?: string) {
    console.log('ssssssssssss', otp);
    if (!isNaN(Number(OTP1 + OTP2 + OTP3 + OTP4))) {
      let token: string = '';
      const response = await Instance.post(`/v1/users/verify/otp`, { sessionId, otp, mobile });
      if (response?.data?.token) {
        await AsyncStorage.setItem('userToken', response?.data?.token);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 3,
            routes: [{ name: 'TabNavigator' }],
          }),
        );
      } else {
        setotpCodeErrorString(response?.data?.msg || "something went wrong");
      }

    } else {
      setotpCodeErrorString('The otp must be a number.');
      setotpCodeHasError(true);
    }
  }

  function onChangeText(num: string, index: number) {
    if (num !== 'Backspace') {
      if (!isNaN(Number(num))) {
        setotpCodeErrorString('');
        setotpCodeHasError(false);
        if (index == 0) {
          setOTP1(num);
          textInput1?.current?.focus();
        } else if (index == 1) {
          setOTP2(num);
          textInput2?.current?.focus();
        } else if (index == 2) {
          setOTP3(num);
          textInput3?.current?.focus();
        } else if (index == 3) {
          setOTP4(num);
          textInput4?.current?.focus();
          // onConfirm('1234');
          Keyboard.dismiss();
        } else if (index == 4) {
          setOTP5(num);
          textInput4?.current?.focus();
          // onConfirm('1234');
          Keyboard.dismiss();
        } else if (index == 5) {
          setOTP6(num);
          textInput4?.current?.focus();
          onConfirm(otp);
          Keyboard.dismiss();
        }
      } else {
        setotpCodeErrorString('The otp must be a number.');
        setotpCodeHasError(true);
      }
    } else {
      if (index == 0) {
        setOTP1('');
      } else if (index == 1) {
        !OTP2 && textInput0?.current?.focus();
        setOTP2('');
      } else if (index == 2) {
        !OTP3 && textInput1?.current?.focus();
        setOTP3('');
      } else if (index == 3) {
        !OTP4 && textInput2?.current?.focus();
        setOTP4('');
      }
    }
  }

  const resetTimer = () => {
    setTimeLeft(30); // Reset the timer to the initial value
    setIsRunning(true);
  };

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

            <View style={styles.viewOtpinput}>
              <View style={styles.viewRow}>
                <TextInput ref={textInput0} autoCorrect={false} autoFocus={true} placeholder="" value={OTP1} maxLength={1} selectionColor={AllColors.black} onKeyPress={e => { onChangeText(e.nativeEvent.key, 0); }} cursorColor={AllColors.black} style={[styles.textInput, { borderWidth: isFocus1 ? 0.5 : 0, borderColor: isFocus1 ? AllColors.shade2 : AllColors.textInput, },]} onFocus={() => setIsFocused1(true)} onBlur={() => setIsFocused1(false)} keyboardType="numeric" />
                <TextInput //@ts-ignore
                  ref={textInput1}
                  autoCorrect={false}
                  placeholder=""
                  value={OTP2}
                  maxLength={1}
                  selectionColor={AllColors.white}
                  onKeyPress={e => { onChangeText(e.nativeEvent.key, 1); }}
                  cursorColor={AllColors.white}
                  style={[styles.textInput, { borderWidth: isFocus2 ? 0.5 : 0, borderColor: isFocus2 ? AllColors.shade2 : AllColors.textInput, },]}
                  onFocus={() => setIsFocused2(true)} // Set focus state to true
                  onBlur={() => setIsFocused2(false)}
                  keyboardType="numeric"
                />
                <TextInput //@ts-ignore
                  ref={textInput2}
                  autoCorrect={false}
                  placeholder=""
                  value={OTP3}
                  maxLength={1}
                  selectionColor={AllColors.white}
                  onKeyPress={e => { onChangeText(e.nativeEvent.key, 2); }}
                  cursorColor={AllColors.white}
                  style={[styles.textInput, { borderWidth: isFocus3 ? 0.5 : 0, borderColor: isFocus3 ? AllColors.shade2 : AllColors.textInput, },]}
                  onFocus={() => setIsFocused3(true)} // Set focus state to true
                  onBlur={() => setIsFocused3(false)}
                  keyboardType="numeric"
                />

                <TextInput //@ts-ignore
                  ref={textInput3}
                  autoCorrect={false}
                  placeholder=""
                  value={OTP4}
                  maxLength={1}
                  selectionColor={AllColors.white}
                  onKeyPress={e => { onChangeText(e.nativeEvent.key, 3); }}
                  cursorColor={AllColors.white}
                  style={[styles.textInput, { borderWidth: isFocus4 ? 0.5 : 0, borderColor: isFocus4 ? AllColors.shade2 : AllColors.textInput, },]}
                  onFocus={() => setIsFocused4(true)} // Set focus state to true
                  onBlur={() => setIsFocused4(false)}
                  keyboardType="numeric"
                />
                <TextInput //@ts-ignore
                  ref={textInput4}
                  autoCorrect={false}
                  placeholder=""
                  value={OTP5}
                  maxLength={1}
                  selectionColor={AllColors.white}
                  onKeyPress={e => { onChangeText(e.nativeEvent.key, 3); }}
                  cursorColor={AllColors.white}
                  style={[styles.textInput, { borderWidth: isFocus4 ? 0.5 : 0, borderColor: isFocus4 ? AllColors.shade2 : AllColors.textInput, },]}
                  onFocus={() => setIsFocused4(true)} // Set focus state to true
                  onBlur={() => setIsFocused4(false)}
                  keyboardType="numeric"
                />
                <TextInput //@ts-ignore
                  ref={textInput5}
                  autoCorrect={false}
                  placeholder=""
                  value={OTP6}
                  maxLength={1}
                  selectionColor={AllColors.white}
                  onKeyPress={e => { onChangeText(e.nativeEvent.key, 3); }}
                  cursorColor={AllColors.white}
                  style={[styles.textInput, { borderWidth: isFocus4 ? 0.5 : 0, borderColor: isFocus4 ? AllColors.shade2 : AllColors.textInput, },]}
                  onFocus={() => setIsFocused4(true)} // Set focus state to true
                  onBlur={() => setIsFocused4(false)}
                  keyboardType="numeric"
                />
              </View>
              {otpCodeHasError && (
                <View>
                  <Text style={styles.textError}>{otpCodeErrorString}</Text>
                </View>
              )}
            </View>
            {timeLeft == 0 ? (
              <Text style={styles.otpTextWhite} onPress={() => { resetTimer(); }}>{`Resend OTP`}</Text>
            ) : (
              <Text style={styles.otpText}>{`Resend OTP in ${timeLeft} Seconds...`}</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default LoginOTP;
