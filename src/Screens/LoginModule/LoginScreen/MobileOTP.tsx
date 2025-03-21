import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Platform, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Images } from '../../../Assets/Images';
import metrics from '../../../Constants/Metrics';
import { Fonts } from '../../../Constants/Fonts';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Instance } from '../../../Api/Instance';

export default function MobileOTP() {

  const navigation = useNavigation<any>()

  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userMobileNumberError, setUserMobileNumberError] = useState('');

  const validateMobileNumber = (number: any) => {
    const regex = /^[0-9]{10}$/;
    if (!regex.test(number)) {
      setUserMobileNumberError('Please enter a valid 10-digit mobile number.');
    } else {
      setUserMobileNumberError('');
    }
    setUserMobileNumber(number);
  };

  const handleSubmit = async () => {
    console.log("userMobileNumber.toString().length !== 10: ", userMobileNumber.length);

    if (userMobileNumber === '') {
      setUserMobileNumberError('Please enter a valid mobile number');
      return;
    }

    try {
      console.log(" ================= api hitted =================");

      const response = await Instance.post(`/v1/users/loginWithMobile`, { mobile: userMobileNumber });

      console.log('response: ', response.data);
      navigation.navigate('LoginOTP', { sessionId: response?.data?.result?.Details, mobile: userMobileNumber });

    } catch (error: any) {
      console.error('Error:', error);
      setUserMobileNumberError(error?.response?.data?.msg || "Opp's something went wrong.");
    }
  };


  return (
    <Container statusBarStyle="dark-content" statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>

      <KeyboardAwareScrollView style={styles.marginView} enableOnAndroidextraScrollHeight={Platform.OS === 'ios' ? 0 : 40} showsVerticalScrollIndicator={false} enableAutomaticScrollkeyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Animated.Image style={styles.logoImage} resizeMode="contain" sharedTransitionTag="Tag" source={Images.Logo} />

            <Text style={styles.phoneText}>Verify With Mobile Number</Text>

            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.mobilephone} />

            <Text style={styles.phoneSubText}>Mobile Number</Text>

            <View style={styles.inputContainer}>
              <View style={styles.InputView}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput style={styles.textInputView} cursorColor={AllColors.black} inputMode="numeric" onChangeText={validateMobileNumber} value={userMobileNumber} placeholder="000 000 0000" placeholderTextColor={AllColors.black} maxLength={10} />
              </View>
              {userMobileNumberError ? (<Text style={styles.errorText}>{userMobileNumberError}</Text>) : null}
            </View>

            <TouchableOpacity onPress={handleSubmit} style={[styles.touchView, { marginTop: 50 }]}>
              <Text style={styles.buttonInsideText}>Sign in with Number</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: metrics.hp2,
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS === 'android' ? metrics.hp9 : metrics.hp3,
  },
  mailImage: {
    width: '30%',
    height: metrics.hp9,
    marginTop: Platform.OS === 'android' ? metrics.hp3 : metrics.hp3,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 30,
    color: AllColors.black,
    marginTop: metrics.hp5,
    lineHeight: 35,
    textAlign: 'center',
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadSemibold,
    fontWeight: 'semibold',
    fontSize: 22,
    color: AllColors.black,
    marginTop: metrics.hp1,
  },
  inputContainer: {
    marginTop: metrics.hp2,
  },
  InputView: {
    flexDirection: 'row',
    marginTop: metrics.hp2,
  },
  countryCode: {
    height: metrics.hp6,
    width: '18%',
    backgroundColor: AllColors.lightGray,
    borderRadius: metrics.hp1,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'semibold',
    justifyContent: 'center',
    color: AllColors.black,
    paddingVertical: 17,
    fontFamily: Fonts.AfacadMedium,
  },
  textInputView: {
    height: metrics.hp6,
    width: '80%',
    backgroundColor: AllColors.lightGray,
    borderRadius: metrics.hp1,
    paddingLeft: 11,
    fontSize: 17,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    left: 5
  },
  errorText: {
    color: AllColors.red,
    fontSize: 10,
    fontFamily: Fonts.AfacadSemibold,
    marginTop: 5,
  },
  touchView: {
    width: '100%',
    marginHorizontal: metrics.hp2,
    height: metrics.hp7,
    backgroundColor: AllColors.midGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: metrics.hp2,
    borderRadius: metrics.hp2,
  },
  primaryButton: {
    backgroundColor: AllColors.primary300,
  },
  buttonInsideText: {
    fontSize: 20,
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.white,
  },
  primaryButtonText: {
    color: AllColors.black,
  },
  marginView: {
    marginBottom: Platform.OS === 'android' ? 0 : 150,
  },
});
