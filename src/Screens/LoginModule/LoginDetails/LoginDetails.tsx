// import {NavigationProp} from '@react-navigation/native';
// import React, {useState} from 'react';
// import {
//   Image,
//   ImageBackground,
//   Keyboard,
//   Platform,
//   SafeAreaView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import {Images} from '../../../Assets/Images';
// import {styles} from './styles';
// import {AllColors} from '../../../Constants/COLORS';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {fontSize} from '../../../Constants/Fonts';
// import {AllRegexss} from '../../../Constants/AllRegexss';
// import Animated from 'react-native-reanimated';
// import metrics from '../../../Constants/Metrics';
// import { Container } from '../../../Components/Container/Container';
// import axios from 'axios';

// interface LoginDetailsProps {
//   route: {params: {Type: string}};
//   navigation: NavigationProp<any, any>;
// }

// const LoginDetails = (props: LoginDetailsProps) => {
//   const [number, onChangeNumber] = useState('');
//   const [isSelected, setIsSelected] = useState<boolean>(false);
//   const [userMobileNumber, setuserMobileNumber] = useState<string>('');
//   const [userEmail, setuserEmail] = useState<string>('');
//   const [userPass, setuserPass] = useState<string>('');
//   const [userMobileNumberHasError, setuserMobileNumberHasError] =
//     useState<boolean>(false);
//   const [userMobileNumberErrorString, setuserMobileNumberErrorString] =
//     useState<string>('');

//   const [userEmailHasError, setuserEmailHasError] = useState<boolean>(false);
//   const [useEmailErrorString, setuserEmailErrorString] = useState<string>('');
//   const [userPassHasError, setuserPassHasError] = useState<boolean>(false);
//   const [userPassHasString, setuserPassHasString] = useState<string>('');

//   const [isEmailSign, setIsEmailSign] = useState<string>(props.route.params.Type);

//   function onChageMobileNumber(text: string) {
//     if (text) {
//       setuserMobileNumber(text);
//       AllRegexss.mobileFormate.test(text)
//         ? (setuserMobileNumberHasError(false),
//           setuserMobileNumberErrorString(''),
//           Keyboard.dismiss())
//         : (setuserMobileNumberHasError(true),
//           setuserMobileNumberErrorString('Please enter valid mobile number'));
//     } else {
//       setuserMobileNumber(text);
//       text.length < 11 && text.length !== 0
//         ? (setuserMobileNumberHasError(true),
//           setuserMobileNumberErrorString('Please enter valid mobile number'))
//         : (setuserMobileNumberHasError(false),
//           setuserMobileNumberErrorString(''));
//     }
//   }

//   function onChageEmail(text: string) {
//     if (text) {
//       setuserEmail(text);
//       AllRegexss.email.test(text)
//         ? (setuserEmailHasError(false),
//           setuserEmailErrorString(''),
//           Keyboard.dismiss())
//         : (setuserEmailHasError(true),
//           setuserEmailErrorString('Please enter valid mobile number'));
//     } else {
//       setuserEmail(text);
//       setuserEmailHasError(false);
//       setuserEmailErrorString('');
//     }
//   }

//   function onChagePassword(text: string) {
//     if (text) {
//       setuserPass(text);
//       AllRegexss.passwordRegx.test(text)
//         ? (setuserPassHasError(false), setuserPassHasString(''))
//         : (setuserPassHasError(true), setuserPassHasString('Please enter a valid password'));
//     } else {
//       setuserPassHasError(false);
//       setuserPassHasString('');
//     }
//   }
  
//   function SendOTP() {
//     if (isEmailSign == 'Email') {
//       const payload = {
//         email: userEmail,
//         password: userPass,
//       };
//         axios
//         .post('https://ricedeal.onrender.com/api/v1/users/login', payload)
//         .then(response => {
//           if (response.data.success) {
//             console.log('Login Success:', response.data.msg);
//             console.log('Token:', response.data.token);
//             props.navigation.navigate('TabNavigator');
//           } else {
//             console.log('Login Failed:', response.data.msg);
//           }
//         })
//         .catch(error => {
//           console.error('Error occurred during login:', error);
//           alert('Error occurred. Please try again later.');
//         });
//     } else {
//       props.navigation.navigate('LoginOTP', {
//         CountryCode: '+91',
//         Number: userMobileNumber,
//       });
//     }
//   }

//   function SendEmail() {
//     if (isEmailSign == 'Email') {
//       setIsEmailSign('OTP');
//     } else {
//       setIsEmailSign('Email');
//     }
//   }

//   return (
//     <Container 
//     statusBarStyle={'dark-content'}
//     statusBarBackgroundColor={AllColors.white}
//     backgroundColor={AllColors.white}>
//       <KeyboardAwareScrollView
//         style={styles.marginView}
//         enableOnAndroid={true}
//         extraScrollHeight={Platform.OS == 'ios' ? 0 : 40}
//         showsVerticalScrollIndicator={false}
//         enableAutomaticScroll={true}
//         keyboardShouldPersistTaps="handled">
//         <TouchableWithoutFeedback
//           onPress={() => {
//             Keyboard.dismiss();
//           }}>
//           <View>
//             <Animated.Image
//               style={styles.logoImage}
//               resizeMode="contain"
//               sharedTransitionTag="Tag"
//               source={Images.Logo}
//             />
//             <Text style={styles.phoneText}>{`Verify With ${
//               isEmailSign == 'Email' ? `E-mail` : 'Number'
//             }`}</Text>
//             <Animated.Image
//               style={styles.mailImage}
//               resizeMode="contain"
//               source={isEmailSign == 'Email' ? Images.tick : Images.mobilephone}
//             />
//             <Text style={styles.phoneSubText}>
//               {`Enter ${isEmailSign == 'Email' ? `E-mail` : 'Phone Number'}`}
//             </Text>
//             {isEmailSign == 'OTP' ? (
//               <View>
//                 <View style={styles.InputView}>
//                   <Text style={styles.countryCode}>+91</Text>
//                   <TextInput
//                     style={styles.textInputView}
//                     cursorColor={AllColors.black}
//                     inputMode="numeric"
//                     onChangeText={number => {
//                       onChageMobileNumber(number);
//                     }}
//                     value={userMobileNumber}
//                     placeholder="000 000 0000"
//                     placeholderTextColor={AllColors.black}
//                     maxLength={10}
//                   />
//                 </View>
//                 {userMobileNumberHasError && (
//                   <Text
//                     style={[styles.phoneSubText, {color: AllColors.red, fontSize: fontSize(10)}]}>
//                     {userMobileNumberErrorString}
//                   </Text>
//                 )}
//               </View>
//             ) : (
//               <View style={[styles.InputView, {flexDirection: 'column'}]}>
//                 <TextInput
//                   style={[styles.textInputView, {width: '100%'}]}
//                   cursorColor={AllColors.black}
//                   inputMode="email"
//                   onChangeText={text => {
//                     onChageEmail(text);
//                   }}
//                   value={userEmail}
//                   placeholder="Please enter your email"
//                   placeholderTextColor={AllColors.black}
//                 />
//                 {userEmailHasError && (
//                   <Text
//                     style={[styles.phoneSubText, {color: AllColors.red, fontSize: fontSize(10)}]}>
//                     {useEmailErrorString}
//                   </Text>
//                 )}
//                 <TextInput
//                   style={[styles.textInputView, {width: '100%', marginTop: metrics.hp2}]}
//                   cursorColor={AllColors.black}
//                   onChangeText={text => {
//                     onChagePassword(text);
//                   }}
//                   value={userPass}
//                   placeholder="Please enter password"
//                   placeholderTextColor={AllColors.black}
//                 />
//                 {userPassHasError && (
//                   <Text
//                     style={[styles.phoneSubText, {color: AllColors.red, fontSize: fontSize(10)}]}>
//                     {userPassHasString}
//                   </Text>
//                 )}
//               </View>
//             )}

//             <TouchableOpacity
//               onPress={SendOTP}
//               style={[styles.touchView, {marginTop: metrics.hp5}]}>
//               <Text style={[styles.buttonInsideText]}>
//                 {isEmailSign == 'Email' ? 'Sign In' : `Send OTP`}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={SendEmail}
//               style={[styles.touchView, {backgroundColor: AllColors.primary300}]}>
//               <Text
//                 style={[styles.buttonInsideText, {color: AllColors.black}]}>
//                 {isEmailSign == 'Email' ? 'Sign in with Number' : `Sign in with E-mail`}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAwareScrollView>
//     </Container>
//   );
// };

// export default LoginDetails;


import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { AllColors } from '../../../Constants/COLORS';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { Container } from '../../../Components/Container/Container';
import InputField from '../../../Components/CustomInput/InputField';
import metrics from '../../../Constants/Metrics';
import Animated from 'react-native-reanimated';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN } from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';

interface LoginDetailsProps {
  route: { params: { Type: string } };
  navigation: NavigationProp<any, any>;
}

const LoginDetails = (props: LoginDetailsProps) => {
  const [userEmail, setuserEmail] = useState<string>('');
  const [userPass, setuserPass] = useState<string>('');
  const [isEmailSign, setIsEmailSign] = useState<string>(props.route.params.Type);
  const [loading, setLoading] = useState<boolean>(false); 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error'); 

  const handleSignin = async () => {
    if (!userEmail || !userPass) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await Instance.post(
        LOGIN.url,
        {
          email: userEmail,
          password: userPass,
        }
      );

      if (response.data.success) {
        const userToken = response.data.token;
        await AsyncStorage.setItem('userToken', userToken);

        setLoading(false);
        setToastMessage('Login successful'); 
        setToastType('success'); 
        props.navigation.navigate('TabNavigator');
      } else {
        setLoading(false);
        setErrorMessage(response.data.msg || 'Login failed');
        setToastMessage('Login failed. Please try again.'); 
        setToastType('error'); 
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('An error occurred. Please try again later.');
      setToastMessage('An error occurred. Please try again later.'); 
      setToastType('error');
    }
  };



  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}
    >
      <KeyboardAwareScrollView
        style={styles.marginView}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS == 'ios' ? 0 : 40}
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <Animated.Image
              style={styles.logoImage}
              resizeMode="contain"      
              sharedTransitionTag="Tag"
              source={Images.Logo}
            />
            <Text style={styles.phoneText}>Verify With Email</Text>
            <Animated.Image
              style={styles.mailImage}
              resizeMode="contain"
              source={isEmailSign == 'Email' ? Images.tick : Images.mobilephone}
            />
            <Text style={styles.phoneSubText}>E-mail</Text>

            <View style={[styles.InputView, { flexDirection: 'column' }]}>
              <InputField
                placeholder="Please enter your email"
                value={userEmail}
                onChangeText={setuserEmail}
              />
              <InputField
                placeholder="Please enter password"
                secureTextEntry
                value={userPass}
                onChangeText={setuserPass}
              />
            </View>

            <View style={{ marginHorizontal: 15 }}>
            <TouchableOpacity
                onPress={handleSignin}
                style={[styles.touchView, { marginTop: metrics.hp5 }]}
                disabled={loading} >
                {loading ? (
                  <ActivityIndicator size="small" color={AllColors.white} /> 
                ) : (
                  <Text style={[styles.buttonInsideText]}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.navigation.navigate('MobileOTP')}
                style={[styles.touchView, { backgroundColor: AllColors.primary300 }]}
              >
                <Text style={[styles.buttonInsideText, { color: AllColors.black }]}>
                  Sign in with Number
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <ToastMessage type={toastType} message={toastMessage} />
    </Container>
  );
};

export default LoginDetails;
