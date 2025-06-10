// (All your existing imports remain unchanged)
import React, { useState } from 'react';
import {
  Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback,
  View, StyleSheet, Platform, Keyboard, ActivityIndicator, Modal, FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Images } from '../../../Assets/Images';
import { Dimensions } from 'react-native';
import { Fonts } from '../../../Constants/Fonts';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Instance } from '../../../Api/Instance';
import countryData from './countryData.json'; // Your JSON file

const { width, height } = Dimensions.get('window');

export default function MobileOTP() {
  const navigation = useNavigation<any>();

  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userMobileNumberError, setUserMobileNumberError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ name: 'India', dial_code: '+91', code: 'IN' });
  const [search, setSearch] = useState('');

  const filteredData = countryData.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const validateMobileNumber = (number: string) => {
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
    //{ mobile: `+${callingCode}${userMobileNumber}`, countryShortName: countryCode, countryCode: callingCode }
    //{ sessionId: response?.data?.result?.Details, mobile: `+${callingCode}${userMobileNumber}`, isfirst: response?.data?.isFirst }
    try {
      setLoading(true);

      const mobile = `${selectedCountry.dial_code}${userMobileNumber}`;
      const response = await Instance.post(`/v1/users/loginWithMobile`, { mobile: `+${selectedCountry.dial_code.replace('+', '')}${userMobileNumber}`, countryShortName: selectedCountry.code, countryCode: selectedCountry.dial_code.replace('+', '') });
      /* const response = await Instance.post(`/v1/users/loginWithMobile`, {
        mobile,
        countryShortName: selectedCountry.code,
        countryCode: selectedCountry.dial_code.replace('+', '')
      }); */

      navigation.navigate('LoginOTP', { sessionId: response?.data?.result?.Details, mobile: `+${selectedCountry.dial_code.replace('+', '')}${userMobileNumber}`, isfirst: response?.data?.isFirst });
      /*  navigation.navigate('LoginOTP', {
         sessionId: response?.data?.result?.Details,
         mobile,
         isfirst: response?.data?.isFirst
       }); */

    } catch (error: any) {
      console.error('Error:', error);
      setUserMobileNumberError(error?.response?.data?.msg || "Oops, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <Container statusBarStyle="dark-content" statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <KeyboardAwareScrollView style={styles.marginView} showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Animated.Image style={styles.logoImage} resizeMode="contain" sharedTransitionTag="Tag" source={Images.Logo} />
            <Text style={styles.phoneText}>Verify With Mobile Number</Text>
            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.mobilephone} />
            <Text style={styles.phoneSubText}>Mobile Number</Text>

            <View style={styles.InputView}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selector}>
                <Text style={styles.selectedText}>{selectedCountry.dial_code} ({selectedCountry.name})</Text>
              </TouchableOpacity>

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

            <TouchableOpacity onPress={handleSubmit} style={[styles.touchView, { marginTop: 50 }]}>
              {loading ? (
                <ActivityIndicator size="small" color={AllColors.white} />
              ) : (
                <Text style={styles.buttonInsideText}>Sign in with Number</Text>
              )}
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
              <View style={styles.modalContainer}>
                <TextInput
                  placeholder="Search country..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                      <Text>{item.name} ({item.dial_code})</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
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
    textAlign: 'center',
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadSemibold,
    fontSize: 20,
    color: AllColors.black,
    marginVertical: height * 0.01,
  },
  InputView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.015,
    gap: 10,
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
  selector: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
  },
  selectedText: {
    fontSize: 16,
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
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
