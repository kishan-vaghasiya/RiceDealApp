import React, { useState, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Images } from '../../../Assets/Images';
import InputField from '../../../Components/CustomInput/InputField';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AllColors } from '../../../Constants/COLORS';
import { styles } from './style';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Fonts } from '../../../Constants/Fonts';
import { Container } from '../../../Components/Container/Container';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_TRADES, REGISTER } from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';

interface Errors {
  name?: string;
  mobileNumber?: string;
  email?: string;
  trade?: string;
  city?: string;
  state?: string;
  password?: string
}

const AboutProfileScreen: React.FC = (props: any) => {
  const [name, setName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [tradeOpen, setTradeOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tradeItems, setTradeItems] = useState<any[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null); // State for toast message
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); // State for toast type

  const fetchTradeData = async () => {
    try {
      const response = await Instance.get(GET_TRADES.url);
      if (response.data.success) {
        const tradeData = response.data.result.map((trade: any) => ({
          label: trade.name,
          value: trade._id,
        }));
        setTradeItems(tradeData);
        console.log('Fetched Trade Data:', tradeData);
      } else {
        Alert.alert('Error', 'Failed to fetch trade data');
      }
    } catch (error) {
      console.error('Error fetching trade data:', error);
      Alert.alert('Error', 'Something went wrong while fetching the trade data');
    }
  };

  useEffect(() => {
    fetchTradeData();
  }, []);

  const handleNameChange = (text: string) => {
    setName(text);
    if (text.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };
  const handleCityChange = (text: string) => {
    setCity(text);
    if (text.trim()) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };
  const handleStateChange = (text: string) => {
    setState(text);
    if (text.trim()) {
      setErrors(prev => ({ ...prev, state: undefined }));
    }
  };
  const handleTradeNameChange = (text: string) => {
    setTradeName(text);
    if (text.trim()) {
      setErrors(prev => ({ ...prev, trade: undefined }));
    }
  };

  const handleMobileChange = (text: string) => {
    setMobileNumber(text);
    if (/^\d{10}$/.test(text)) {
      setErrors(prev => ({ ...prev, mobileNumber: undefined }));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text)) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim()) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
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

        formData.append('image', { uri: profilePic ? profilePic : defaultProfilePic, type: 'image/jpeg', name: 'profilePic.jpg', });

        const response = await Instance.post(REGISTER.url, formData, { headers: { 'Content-Type': 'multipart/form-data', }, });

        if (response.data.success) {
          console.log('User registered successfully:', response.data);
          await AsyncStorage.setItem('userToken', response.data.token);
          setToastMessage('Registration successful!'); // Success message
          setToastType('success'); // Set success type for the toast
          props.navigation.navigate('ChoosePlan');
        } else {
          setToastMessage(response.data.msg || 'Registration failed'); // Error message
          setToastType('error'); // Set error type for the toast
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setToastMessage('Something went wrong while registering the user'); // Error message
        setToastType('error'); // Set error type for the toast
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setProfilePic(selectedImage);
      } else {
        Alert.alert('Image selection failed!');
      }
    });
  };

  const defaultProfilePic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s';
  const imageSource = profilePic ? { uri: profilePic } : { uri: defaultProfilePic };
  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <CustomHeader type="back" screenName="About Profile" onPressBack={() => { props.navigation.goBack(); }} />
      <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={Platform.OS == 'ios' ? 0 : 40} enableAutomaticScroll={true} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View>
            <View style={styles.avatarContainer}>
              <Animated.View>
                <Image style={{ width: 90, height: 90, borderRadius: 45 }} source={imageSource} />
              </Animated.View>
              <TouchableOpacity style={styles.editPhotoButton} onPress={handleImagePick}>
                <Image style={{ width: metrics.hp14, height: metrics.hp7 }} resizeMode="contain" source={Images.editFrame} />
              </TouchableOpacity>
            </View>

            <InputField label="User Name" placeholder="Enter your Name" value={name} onChangeText={handleNameChange} error={errors.name} />
            <InputField label="Email Address" placeholder="Enter your Email Address" value={email} onChangeText={handleEmailChange} keyboardType="email-address" error={errors.email} />
            <InputField label="Mobile Number" placeholder="Enter your Mobile Number" value={mobileNumber} onChangeText={handleMobileChange} keyboardType="phone-pad" error={errors.mobileNumber} maxLength={10} />
            <Text style={styles.Tradetitile}>Trade Name</Text>
            <View style={{ marginHorizontal: 15 }}>
              <DropDownPicker
                open={tradeOpen}
                value={tradeName}
                items={tradeItems}
                setOpen={setTradeOpen}
                etValue={setTradeName}
                setItems={setTradeItems}
                placeholder="Select your Trade Name"
                containerStyle={{ marginVertical: metrics.hp1 }}
                onChangeValue={(selectedValue) => {
                  console.log("Selected Trade ID: ", selectedValue);
                  const selectedTrade = tradeItems.find(item => item.value === selectedValue); if (selectedTrade) { console.log("Selected Trade: ", selectedTrade); }
                }}
                style={{ backgroundColor: AllColors.lightGray, borderColor: AllColors.lightGray, marginHorizontal: metrics.hp1, alignSelf: 'center', }}
                dropDownContainerStyle={{ backgroundColor: AllColors.lightGray, borderWidth: 0, }}
                placeholderStyle={{ color: 'grey', fontSize: 17, fontFamily: Fonts.AfacadRegular, }}
              />
            </View>


            <InputField label="City" placeholder="Enter your City" value={city} onChangeText={handleCityChange} keyboardType="default" error={errors.city} />
            <InputField label="State" placeholder="Enter your State" value={state} onChangeText={handleStateChange} keyboardType="default" error={errors.state} />
            <InputField label="Password" placeholder="Enter your Password" value={password} onChangeText={handlePasswordChange} secureTextEntry={true} error={errors.password} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
              {loading ? (<ActivityIndicator size="small" color={AllColors.white} />) : (<Text style={styles.saveButtonText}>Save</Text>)}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <ToastMessage type={toastType} message={toastMessage} />
    </Container>
  );
};

export default AboutProfileScreen;
