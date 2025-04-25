import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { styles } from './style';
import Animated from 'react-native-reanimated';
import { Images } from '../../../Assets/Images';
import InputField from '../../../Components/CustomInput/InputField';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AllColors } from '../../../Constants/COLORS';
import { Fonts } from '../../../Constants/Fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import { Container } from '../../../Components/Container/Container';
import { launchImageLibrary } from 'react-native-image-picker';
import { Instance } from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import metrics from '../../../Constants/Metrics';

interface Errors {
  name?: string;
  mobileNumber?: string;
  email?: string;
  trade?: string;
  city?: string;
  state?: string;
  password?: string; // Add password error field
}

const EditProfile: React.FC = (props: any) => {
  const [name, setName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeItems, setTradeItems] = useState<any[]>([]);

  // Fetch trade data from API
  const fetchTradeData = async () => {
    try {
      const response = await Instance.get('/v1/trades');
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

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('User Token:', token);
  
      if (validateInputs()) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('password', password);
        formData.append('trade', tradeName);
        formData.append('city', city);
        formData.append('state', state);
  
        if (profilePic) {
          const imageFile = {
            uri: profilePic,
            type: 'image/jpeg',
            name: 'profile_pic.jpg',
          };
          formData.append('image', imageFile);
        }
  
        console.log('Form Data:', formData);
  
        const response = await Instance.put('v1/users/imageUpdate', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
  
        if (response.data.success) {
          Alert.alert('Success', 'Profile updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update profile');
        }
      } else {
        console.log('Validation failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      Alert.alert('Error', 'Something went wrong while updating your profile');
    }
  };
  

  const validateInputs = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
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
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, password: undefined}));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, name: undefined}));
    }
  };
  const handleCityChange = (text: string) => {
    setCity(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, city: undefined}));
    }
  };
  const handleStateChange = (text: string) => {
    setState(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, state: undefined}));
    }
  };
  const handleTradeNameChange = (text: string) => {
    setTradeName(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, trade: undefined}));
    }
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
      <CustomHeader
        type="back"
        screenName="Edit Profile"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        style={styles.marginView}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS == 'ios' ? 0 : 40}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View style={{}}>
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
            <InputField label="Mobile Number" placeholder="Enter your Mobile Number" value={mobileNumber} onChangeText={handleMobileChange} keyboardType="phone-pad" error={errors.mobileNumber} />
            <InputField label="Password" placeholder="Enter your Password" value={password} onChangeText={handlePasswordChange} secureTextEntry={true} error={errors.password} />
            <Text style={{ color: AllColors.black, fontSize: 18, fontFamily: Fonts.AfacadBold, marginHorizontal: 15 }}>Trade Name</Text>
             <View style={{marginHorizontal:15}}>
              <DropDownPicker
              open={tradeOpen}
              value={tradeName}
              items={tradeItems}
              setOpen={setTradeOpen}
              setValue={setTradeName}
              setItems={setTradeItems}
              placeholder="Select your Trade Name"
              containerStyle={{ marginVertical: metrics.hp1 }}
              style={{
                backgroundColor: AllColors.lightGray,
                borderColor: AllColors.lightGray,
                marginHorizontal: metrics.hp1,
                alignSelf: 'center',
              }}
              dropDownContainerStyle={{ backgroundColor: AllColors.lightGray, borderWidth: 0 }}
              placeholderStyle={{
                color: 'grey',
                fontSize: 17,
                fontFamily: Fonts.AfacadRegular,
              }}
            />
             </View>
          
            <InputField label="City" placeholder="Enter your City" value={city} onChangeText={handleCityChange} error={errors.city} />
            <InputField label="State" placeholder="Enter your State" value={state} onChangeText={handleStateChange} error={errors.state} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EditProfile;
