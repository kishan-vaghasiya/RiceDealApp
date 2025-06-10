import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Images } from '../../../Assets/Images';
import metrics from '../../../Constants/Metrics';
import { Fonts } from '../../../Constants/Fonts';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Instance } from '../../../Api/Instance';
import CountryPicker from 'react-native-country-picker-modal';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function MobileOTP() {

  const navigation = useNavigation<any>();

  const [countryCode, setCountryCode] = useState("IN"); // Default to India
  const [callingCode, setCallingCode] = useState('91');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userMobileNumberError, setUserMobileNumberError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateMobileNumber = (number: string) => {
    // Allow only numeric input
    const regex = /^[0-9]*$/;
    if (!regex.test(number)) {
      setUserMobileNumberError('Mobile number must contain only digits.');
    } else {
      setUserMobileNumberError('');
    }
    setUserMobileNumber(number);
  };

  const handleSubmit = async () => {
    if (userMobileNumber === '') {
      setUserMobileNumberError('Please enter a valid mobile number');
      return;
    }

    try {
      setLoading(true);
      const response = await Instance.post(`/v1/users/loginWithMobile`, { mobile: `+${callingCode}${userMobileNumber}`, countryShortName: countryCode, countryCode: callingCode });
      navigation.navigate('LoginOTP', { sessionId: response?.data?.result?.Details, mobile: `+${callingCode}${userMobileNumber}`, isfirst: response?.data?.isFirst });
    } catch (error: any) {
      console.error('Error:', error);
      setUserMobileNumberError(error?.response?.data?.msg || "Oops, something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container statusBarStyle="dark-content" statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <KeyboardAwareScrollView style={styles.marginView} showsVerticalScrollIndicator={false} >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Animated.Image style={styles.logoImage} resizeMode="contain" sharedTransitionTag="Tag" source={Images.Logo} />
            <Text style={styles.phoneText}>Verify With Mobile Number</Text>
            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.mobilephone} />
            <Text style={styles.phoneSubText}>Mobile Number</Text>


            <View style={styles.InputView}>
              <TouchableOpacity onPress={() => setShowCountryPicker(true)} style={styles.countryPicker}>
                <Text style={styles.countryCodeText}>+{callingCode}</Text>
              </TouchableOpacity>

              <CountryPicker
                withFilter
                withFlag
                withCallingCode
                // withCountryNameButton
                // withEmoji
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
                onSelect={(country) => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
                countryCode={countryCode}
              />

              <TextInput
                style={styles.textInputView}
                cursorColor={AllColors.black}
                inputMode="numeric"
                onChangeText={validateMobileNumber}
                value={userMobileNumber}
                placeholder="000 000 0000"
                placeholderTextColor={AllColors.black}
              />
            </View>
            {userMobileNumberError ? (
              <Text style={styles.errorText}>{userMobileNumberError}</Text>
            ) : null}

            {/* <TouchableOpacity onPress={() => navigation.navigate('CompleteProfile')} >
              <Text>complete profile</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={handleSubmit} style={[styles.touchView, { marginTop: 50 }]}>
              {loading ? (
                <ActivityIndicator size="small" color={AllColors.white} />
              ) : (
                <Text style={styles.buttonInsideText}>Sign in with Number</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width/1.4,
    paddingTop: height * 0.05,
  },
  logoImage: {
    width: '100%',
    height: height * 0.25,
    marginBottom: height * 0.02,
  },
  mailImage: {
    width: '30%',
    height: height * 0.1,
    marginTop: height * 0.02,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 28,
    color: AllColors.black,
    marginTop: height * 0.02,
    lineHeight: 34,
    textAlign: 'center',
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadSemibold,
    fontSize: 20,
    color: AllColors.black,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  InputView: {
    flexDirection: 'row',
    marginTop: height * 0.015,
    alignItems: 'center',
    width: '100%',
  },
  textInputView: {
    flex: 1,
    height: 55,
    backgroundColor: AllColors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
  countryPicker: {
    backgroundColor: AllColors.lightGray,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  errorText: {
    color: AllColors.red,
    fontSize: 12,
    fontFamily: Fonts.AfacadSemibold,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  touchView: {
    width: '100%',
    height: 55,
    backgroundColor: AllColors.midGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: height * 0.06,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonInsideText: {
    fontSize: 18,
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.white,
  },
  marginView: {
    flex: 1,
    backgroundColor: AllColors.white,
  }
});
