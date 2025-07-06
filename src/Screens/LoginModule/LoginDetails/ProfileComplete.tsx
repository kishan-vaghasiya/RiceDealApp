// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
// import Animated from 'react-native-reanimated';
// import { Images } from '../../../Assets/Images';
// import InputField from '../../../Components/CustomInput/InputField';
// import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
// import metrics from '../../../Constants/Metrics';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { AllColors } from '../../../Constants/COLORS';
// import { styles } from '../AboutProfile/style';
// import { launchImageLibrary } from 'react-native-image-picker';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { Fonts } from '../../../Constants/Fonts';
// import { Container } from '../../../Components/Container/Container';
// import { Instance } from '../../../Api/Instance';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GET_TRADES, REGISTER } from '../../../Api/Api_End_Points';
// import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
// import { CommonActions } from '@react-navigation/native';
// import CheckBox from '@react-native-community/checkbox';

// interface Errors {
//     name?: string;
//     mobileNumber?: string;
//     email?: string;
//     trade?: string;
//     city?: string;
//     state?: string;
//     password?: string
// }

// const ProfileComplete: React.FC = (props: any) => {
//     const user = props?.route?.params?.user
//     // console.log("user: ", user);

//     const id = user?._id
//     const [name, setName] = useState<string>('');
//     const [tradeName, setTradeName] = useState<string>('');
//     const [city, setCity] = useState<string>('');
//     const [state, setState] = useState<string>('');
//     const [mobileNumber, setMobileNumber] = useState<string>('');
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [profilePic, setProfilePic] = useState<any>('');
//     const [errors, setErrors] = useState<Errors>({});
//     const [tradeOpen, setTradeOpen] = useState(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [tradeItems, setTradeItems] = useState<any[]>([]);
//     const [token, setToken] = useState<any>()
//     const [shopName, setShopName] = useState<any>()
//     const [country, setCountry] = useState<any>()

//     const [term, setTerm] = useState<boolean>(false);

//     const [toastMessage, setToastMessage] = useState<string | null>(null); // State for toast message
//     const [toastType, setToastType] = useState<'success' | 'error'>('success'); // State for toast type

//     const fetchTradeData = async () => {
//         try {
//             const response = await Instance.get(GET_TRADES.url);
//             if (response.data.success) {
//                 const tradeData = response.data.result.map((trade: any) => ({
//                     label: trade.name,
//                     value: trade._id,
//                 }));
//                 setTradeItems(tradeData);
//                 console.log('Fetched Trade Data:', tradeData);
//             } else {
//                 Alert.alert('Error', 'Failed to fetch trade data');
//             }
//         } catch (error) {
//             console.error('Error fetching trade data:', error);
//             Alert.alert('Error', 'Something went wrong while fetching the trade data');
//         }
//     };

//     const getUserTOken = async () => {
//         const userToken = await AsyncStorage.getItem('userToken');
//         setToken(userToken)
//     }

//     useEffect(() => {
//         getUserTOken()
//         fetchTradeData();
//     }, []);

//     const handleNameChange = (text: string) => {
//         setName(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, name: undefined }));
//         }
//     };
//     const handleShopNameChange = (text: string) => {
//         setShopName(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, shopName: undefined }));
//         }
//     };
//     const handleCountryChange = (text: string) => {
//         setCountry(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, country: undefined }));
//         }
//     };
//     const handleCityChange = (text: string) => {
//         setCity(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, city: undefined }));
//         }
//     };
//     const handleStateChange = (text: string) => {
//         setState(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, state: undefined }));
//         }
//     };
//     const handleTradeNameChange = (text: string) => {
//         setTradeName(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, trade: undefined }));
//         }
//     };

//     const handleMobileChange = (text: string) => {
//         setMobileNumber(text);
//         if (/^\d{10}$/.test(text)) {
//             setErrors(prev => ({ ...prev, mobileNumber: undefined }));
//         }
//     };

//     const handleEmailChange = (text: string) => {
//         setEmail(text);
//         if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text)) {
//             setErrors(prev => ({ ...prev, email: undefined }));
//         }
//     };
//     const handlePasswordChange = (text: string) => {
//         setPassword(text);
//         if (text.trim()) {
//             setErrors(prev => ({ ...prev, password: undefined }));
//         }
//     };

//     const validateInputs = (): boolean => {
//         const newErrors: Errors = {};
//         if (!name.trim()) newErrors.name = 'Name is required';
//         if (!state.trim()) newErrors.state = 'State is required';
//         if (!city.trim()) newErrors.city = 'City is required';
//         /* if (!mobileNumber.trim()) {
//             newErrors.mobileNumber = 'Mobile number is required';
//         } else if (!/^\d{10}$/.test(mobileNumber)) {
//             newErrors.mobileNumber = 'Invalid mobile number';
//         } */
//         if (!email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//             newErrors.email = 'Invalid email address';
//         }
//         if (!password.trim()) newErrors.password = 'Password is required';
//         else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSave = async () => {
//         console.log("clicked: ");

//         if (validateInputs()) {
//             console.log("inside validate inputs");

//             setLoading(true);
//             try {
//                 const formData = new FormData();
//                 formData.append('name', name);
//                 formData.append('email', email);
//                 formData.append('mobile', mobileNumber);
//                 formData.append('password', password);
//                 formData.append('city', city);
//                 formData.append('state', state);
//                 formData.append('trade', tradeName);
//                 formData.append('country', country);
//                 formData.append('shopName', shopName);

//                 formData.append('image', { uri: profilePic ? profilePic : defaultProfilePic, type: 'image/jpeg', name: 'profilePic.jpg', });
//                 // console.log("formdAta: ", formData);

//                 const response = await Instance.put(`/v1/users/completeProfile/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }, });

//                 if (response.data.success) {
//                     console.log('User registered successfully:', response.data);
//                     await AsyncStorage.setItem('userToken', response.data.token);
//                     setToastMessage('Registration successful!'); // Success message
//                     setToastType('success'); // Set success type for the toast
//                     // props.navigation.navigate('ChoosePlan');
//                     props.navigation.dispatch(
//                         CommonActions.reset({
//                             index: 3,
//                             routes: [{ name: 'TabNavigator' }],
//                         }),
//                     );
//                 } else {
//                     setToastMessage(response.data.msg || 'Registration failed'); // Error message
//                     setToastType('error'); // Set error type for the toast
//                 }
//             } catch (error: any) {
//                 // console.error('Error during registration:', error);
//                 // console.log("error: ", error?.response?.data);

//                 setToastMessage(error?.response?.data?.msg || 'Something went wrong while registering the user'); // Error message
//                 setToastType('error'); // Set error type for the toast
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleImagePick = () => {
//         launchImageLibrary({ mediaType: 'photo', includeBase64: false }, response => {
//             if (response.assets && response.assets.length > 0) {
//                 const selectedImage = response.assets[0].uri;
//                 setProfilePic(selectedImage);
//             } else {
//                 Alert.alert('Image selection failed!');
//             }
//         });
//     };

//     // console.log("term: ", term);

//     const defaultProfilePic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s';
//     const imageSource = profilePic ? { uri: profilePic } : { uri: defaultProfilePic };
//     return (
//         <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
//             <CustomHeader type="back" screenName="About Profile" onPressBack={() => { props.navigation.goBack(); }} />
//             <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={Platform.OS == 'ios' ? 0 : 40} enableAutomaticScroll={true} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
//                 <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
//                     <View>
//                         <View style={styles.avatarContainer}>
//                             <Animated.View>
//                                 <Image style={{ width: 90, height: 90, borderRadius: 45 }} source={imageSource} />
//                             </Animated.View>
//                             <TouchableOpacity style={styles.editPhotoButton} onPress={handleImagePick}>
//                                 <Image style={{ width: metrics.hp14, height: metrics.hp7 }} resizeMode="contain" source={Images.editFrame} />
//                             </TouchableOpacity>
//                         </View>

//                         <InputField label="User Name" placeholder="Enter your Name" value={name} onChangeText={handleNameChange} error={errors.name} />
//                         <InputField label="Email Address" placeholder="Enter your Email Address" value={email} onChangeText={handleEmailChange} keyboardType="email-address" error={errors.email} />
//                         {/* <InputField label="Mobile Number" placeholder="Enter your Mobile Number" value={mobileNumber} onChangeText={handleMobileChange} keyboardType="phone-pad" error={errors.mobileNumber} maxLength={10} /> */}
//                         <InputField label="Trand Name" placeholder="Enter your show name" value={shopName} onChangeText={handleShopNameChange} error={errors.name} />

//                         <Text style={styles.Tradetitile}>Select Your Business Category</Text>
//                         <View style={{ marginHorizontal: 15 }}>
//                             <DropDownPicker
//                                 open={tradeOpen}
//                                 value={tradeName}
//                                 items={tradeItems}
//                                 setOpen={setTradeOpen}
//                                 setValue={setTradeName}
//                                 setItems={setTradeItems}
//                                 placeholder="Select your Trade Name"
//                                 containerStyle={{ marginVertical: metrics.hp1 }}
//                                 onChangeValue={(selectedValue) => {
//                                     const selectedTrade = tradeItems.find(item => item.value === selectedValue);
//                                     if (selectedTrade) {
//                                         // console.log("Selected Trade: ", selectedTrade);
//                                     }
//                                 }}
//                                 style={{
//                                     backgroundColor: AllColors.lightGray,
//                                     borderColor: AllColors.lightGray,
//                                     marginHorizontal: metrics.hp1,
//                                     alignSelf: 'center',
//                                 }}
//                                 dropDownContainerStyle={{
//                                     backgroundColor: AllColors.lightGray,
//                                     borderColor: AllColors.gray,
//                                 }}
//                             />
//                         </View>

//                         <InputField label="City" placeholder="Enter your City" value={city} onChangeText={handleCityChange} keyboardType="default" error={errors.city} />
//                         <InputField label="State" placeholder="Enter your State" value={state} onChangeText={handleStateChange} keyboardType="default" error={errors.state} />
//                         <InputField label="Country" placeholder="Enter your Country" value={country} onChangeText={handleCountryChange} keyboardType="default" error={errors.state} />
//                         <InputField label="Password" placeholder="Enter your Password" value={password} onChangeText={handlePasswordChange} secureTextEntry={true} error={errors.password} />

//                         {/* <View style={{ marginLeft: '5%' }}>
//                             <CheckBox value={term} onValueChange={setTerm} tintColors={{ true: '#007AFF', false: '#999' }} />
//                             <Text style={{ color: 'black' }}>I agree to the Terms & Conditions</Text>
//                         </View> */}
//                         <View style={{ marginLeft: '5%', flexDirection: 'row', alignItems: 'center' }}>
//                             <CheckBox
//                                 value={term}
//                                 onValueChange={setTerm}
//                                 tintColors={{ true: '#007AFF', false: '#999' }}
//                             />
//                             <Text style={{ color: 'black', marginLeft: 8 }}>I agree to the Terms & Conditions</Text>
//                         </View>

//                         <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
//                             {loading ? (<ActivityIndicator size="small" color={AllColors.white} />) : (<Text style={styles.saveButtonText}>Save</Text>)}
//                         </TouchableOpacity>

//                     </View>
//                 </TouchableWithoutFeedback>
//             </KeyboardAwareScrollView>
//             <ToastMessage type={toastType} message={toastMessage} />
//         </Container>
//     );
// };

// export default ProfileComplete;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {Images} from '../../../Assets/Images';
import InputField from '../../../Components/CustomInput/InputField';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AllColors} from '../../../Constants/COLORS';
import {launchImageLibrary} from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Fonts} from '../../../Constants/Fonts';
import {Container} from '../../../Components/Container/Container';
import {Instance} from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_TRADES, REGISTER} from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import {CommonActions} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

interface Errors {
  name?: string;
  mobileNumber?: string;
  email?: string;
  trade?: string;
  city?: string;
  state?: string;
  password?: string;
  shopName?: string;
  country?: string;
}

const ProfileComplete: React.FC = (props: any) => {
  const user = props?.route?.params?.user;
  const id = user?._id;

  // Form state
  const [name, setName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profilePic, setProfilePic] = useState<any>('');
  const [shopName, setShopName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [term, setTerm] = useState<boolean>(false);

  // UI state
  const [errors, setErrors] = useState<Errors>({});
  const [tradeOpen, setTradeOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tradeItems, setTradeItems] = useState<any[]>([]);
  const [token, setToken] = useState<any>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const defaultProfilePic =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s';
  const imageSource = profilePic ? {uri: profilePic} : {uri: defaultProfilePic};

  useEffect(() => {
    getUserToken();
    fetchTradeData();
  }, []);

  const fetchTradeData = async () => {
    try {
      const response = await Instance.get(GET_TRADES.url);
      if (response.data.success) {
        const tradeData = response.data.result.map((trade: any) => ({
          label: trade.name,
          value: trade._id,
        }));
        setTradeItems(tradeData);
      } else {
        Alert.alert('Error', 'Failed to fetch trade data');
      }
    } catch (error) {
      console.error('Error fetching trade data:', error);
      Alert.alert(
        'Error',
        'Something went wrong while fetching the trade data',
      );
    }
  };

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    setToken(userToken);
  };

  // Handler functions
  const handleNameChange = (text: string) => {
    setName(text);
    if (text.trim()) setErrors(prev => ({...prev, name: undefined}));
  };

  const handleShopNameChange = (text: string) => {
    setShopName(text);
    if (text.trim()) setErrors(prev => ({...prev, shopName: undefined}));
  };

  const handleCountryChange = (text: string) => {
    setCountry(text);
    if (text.trim()) setErrors(prev => ({...prev, country: undefined}));
  };

  const handleCityChange = (text: string) => {
    setCity(text);
    if (text.trim()) setErrors(prev => ({...prev, city: undefined}));
  };

  const handleStateChange = (text: string) => {
    setState(text);
    if (text.trim()) setErrors(prev => ({...prev, state: undefined}));
  };

  const handleTradeNameChange = (text: string) => {
    setTradeName(text);
    if (text.trim()) setErrors(prev => ({...prev, trade: undefined}));
  };

  const handleMobileChange = (text: string) => {
    setMobileNumber(text);
    if (/^\d{10}$/.test(text)) {
      setErrors(prev => ({...prev, mobileNumber: undefined}));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text)) {
      setErrors(prev => ({...prev, email: undefined}));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, password: undefined}));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!tradeName) newErrors.trade = 'Business category is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long';
    if (!term) newErrors.password = 'You must accept terms & conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!term) {
      setToastMessage('Please accept terms & conditions');
      setToastType('error');
      return;
    }

    if (validateInputs()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile', mobileNumber);
        formData.append('password', password);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('trade', tradeName);
        formData.append('country', country);
        formData.append('shopName', shopName);
        formData.append('image', {
          uri: profilePic ? profilePic : defaultProfilePic,
          type: 'image/jpeg',
          name: 'profilePic.jpg',
        });

        const response = await Instance.put(
          `/v1/users/completeProfile/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          await AsyncStorage.setItem('userToken', response.data.token);
          setToastMessage('Profile updated successfully!');
          setToastType('success');
          props.navigation.dispatch(
            CommonActions.reset({
              index: 3,
              routes: [{name: 'TabNavigator'}],
            }),
          );
        } else {
          setToastMessage(response.data.msg || 'Update failed');
          setToastType('error');
        }
      } catch (error: any) {
        setToastMessage(error?.response?.data?.msg || 'Something went wrong');
        setToastType('error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0].uri;
          setProfilePic(selectedImage);
        } else if (response.didCancel) {
          // User cancelled the picker
        } else {
          Alert.alert('Error', 'Failed to select image');
        }
      },
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Complete Your Profile"
        onPressBack={() => props.navigation.goBack()}
      />

      <KeyboardAwareScrollView
        style={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS == 'ios' ? 0 : 40}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image style={styles.profileImage} source={imageSource} />
                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={handleImagePick}>
                  <Image
                    style={styles.editIcon}
                    resizeMode="contain"
                    source={Images.editFrame}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileTitle}>Add Profile Photo</Text>
            </View>
            {/* Form Section */}
            <View style={styles.formContainer}>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={handleNameChange}
                error={errors.name}
              />

              <InputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                error={errors.email}
              />

              <InputField
                label="Shop/Business Name"
                placeholder="Enter your shop name"
                value={shopName}
                onChangeText={handleShopNameChange}
                error={errors.shopName}
              />

              <Text style={styles.dropdownLabel}>Business Category</Text>
              <DropDownPicker
                open={tradeOpen}
                value={tradeName}
                items={tradeItems}
                setOpen={setTradeOpen}
                setValue={setTradeName}
                setItems={setTradeItems}
                placeholder="Select your business category"
                placeholderStyle={styles.dropdownPlaceholder}
                style={[
                  styles.dropdown,
                  errors.trade ? styles.dropdownError : {},
                ]}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                listItemLabelStyle={styles.dropdownItemText}
                selectedItemLabelStyle={styles.dropdownSelectedItem}
                zIndex={3000}
                zIndexInverse={1000}
              />
              {errors.trade && (
                <Text style={styles.errorText}>{errors.trade}</Text>
              )}

              <View style={styles.locationContainer}>
                <View style={[styles.halfInput, {marginRight: 10}]}>
                  <InputField
                    label="City"
                    placeholder="Your city"
                    value={city}
                    onChangeText={handleCityChange}
                    error={errors.city}
                  />
                </View>
                <View style={styles.halfInput}>
                  <InputField
                    label="State"
                    placeholder="Your state"
                    value={state}
                    onChangeText={handleStateChange}
                    error={errors.state}
                  />
                </View>
              </View>

              <InputField
                label="Country"
                placeholder="Enter your country"
                value={country}
                onChangeText={handleCountryChange}
                error={errors.country}
              />

              <InputField
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
                error={errors.password}
              />

              {/* Terms & Conditions */}
              <View style={styles.termsContainer}>
                <CheckBox
                  value={term}
                  onValueChange={setTerm}
                  tintColors={{
                    true: AllColors.primary900,
                    false: AllColors.gray,
                  }}
                  style={styles.checkbox}
                />
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
              disabled={loading}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[AllColors.primary900, AllColors.primary700]}
                style={styles.gradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                {loading ? (
                  <ActivityIndicator size="small" color={AllColors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Complete Profile</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <ToastMessage type={toastType} message={toastMessage} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: AllColors.primary900,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: AllColors.white,
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  profileTitle: {
    fontSize: 16,
    color: AllColors.grayDark,
    fontFamily: '600',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  dropdownLabel: {
    fontSize: 14,
    color: AllColors.grayDark,
    marginBottom: 8,
    fontFamily: '600',
  },
  dropdown: {
    backgroundColor: AllColors.lightGray,
    borderWidth: 0,
    borderRadius: 8,
    minHeight: 50,
    marginBottom: 15,
  },
  dropdownPlaceholder: {
    color: AllColors.gray,
    fontSize: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: AllColors.black,
  },
  dropdownContainer: {
    backgroundColor: AllColors.lightGray,
    borderWidth: 0,
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  dropdownSelectedItem: {
    color: AllColors.primary900,
    fontWeight: 'bold',
  },
  dropdownError: {
    borderWidth: 1,
    borderColor: AllColors.error,
  },
  errorText: {
    color: AllColors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginLeft: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: AllColors.grayDark,
  },
  termsLink: {
    color: AllColors.primary900,
    textDecorationLine: 'underline',
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  gradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: AllColors.white,
    fontSize: 16,
    fontFamily: 'bold',
  },
});

export default ProfileComplete;
