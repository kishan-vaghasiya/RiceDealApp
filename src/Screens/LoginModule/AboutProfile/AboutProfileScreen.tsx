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
} from 'react-native';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import {Images} from '../../../Assets/Images';
import InputField from '../../../Components/CustomInput/InputField';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AllColors} from '../../../Constants/COLORS';
// import {styles} from './style';
import {launchImageLibrary} from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Fonts} from '../../../Constants/Fonts';
import {Container} from '../../../Components/Container/Container';
import {Instance} from '../../../Api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_TRADES, REGISTER} from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Errors {
  name?: string;
  mobileNumber?: string;
  email?: string;
  trade?: string;
  city?: string;
  state?: string;
  password?: string;
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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

  useEffect(() => {
    fetchTradeData();
  }, []);

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
  
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim()) {
      setErrors(prev => ({...prev, password: undefined}));
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
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long';

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

        formData.append('image', {
          uri: profilePic ? profilePic : defaultProfilePic,
          type: 'image/jpeg',
          name: 'profilePic.jpg',
        });

        const response = await Instance.post(REGISTER.url, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        if (response.data.success) {
          await AsyncStorage.setItem('userToken', response.data.token);
          setToastMessage('Registration successful!');
          setToastType('success');
          props.navigation.navigate('ChoosePlan');
        } else {
          setToastMessage(response.data.msg || 'Registration failed');
          setToastType('error');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setToastMessage('Something went wrong while registering the user');
        setToastType('error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setProfilePic(selectedImage);
      } else {
        Alert.alert('Image selection failed!');
      }
    });
  };

  const defaultProfilePic =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s';
  const imageSource = profilePic ? {uri: profilePic} : {uri: defaultProfilePic};
  
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Complete Your Profile"
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
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Profile Picture Section */}
            <Animated.View 
              entering={FadeIn.duration(500)}
              style={styles.avatarContainer}
            >
              <View style={styles.profileImageWrapper}>
                <Image
                  style={styles.profileImage}
                  source={imageSource}
                />
                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={handleImagePick}>
                  <Icon name="edit" size={20} color={AllColors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileText}>Add Profile Photo</Text>
            </Animated.View>

            {/* Form Section */}
            <Animated.View 
              entering={FadeInDown.duration(800).delay(200)}
              style={styles.formContainer}
            >
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={handleNameChange}
                error={errors.name}
                icon="person"
              />
              
              <InputField
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                error={errors.email}
                icon="email"
              />
              
              <InputField
                label="Mobile Number"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChangeText={handleMobileChange}
                keyboardType="phone-pad"
                error={errors.mobileNumber}
                maxLength={10}
                icon="phone"
              />
              
              <Text style={styles.dropdownLabel}>Trade Name</Text>
              <DropDownPicker
                open={tradeOpen}
                value={tradeName}
                items={tradeItems}
                setOpen={setTradeOpen}
                setValue={setTradeName}
                setItems={setTradeItems}
                placeholder="Select your trade"
                placeholderStyle={styles.dropdownPlaceholder}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                ArrowDownIconComponent={() => <Icon name="arrow-drop-down" size={24} color="#666" />}
                ArrowUpIconComponent={() => <Icon name="arrow-drop-up" size={24} color="#666" />}
                TickIconComponent={() => <Icon name="check" size={18} color={AllColors.primary} />}
              />
              
              <InputField
                label="City"
                placeholder="Enter your city"
                value={city}
                onChangeText={handleCityChange}
                keyboardType="default"
                error={errors.city}
                icon="location-city"
              />
              
              <InputField
                label="State"
                placeholder="Enter your state"
                value={state}
                onChangeText={handleStateChange}
                keyboardType="default"
                error={errors.state}
                icon="map"
              />
              
              <InputField
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
                error={errors.password}
                icon="lock"
              />
              
              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[AllColors.primary, AllColors.primaryDark]}
                  style={styles.saveButton}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={AllColors.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save & Continue</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: AllColors.primaryLight,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: AllColors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AllColors.white,
  },
  profileText: {
    marginTop: 10,
    fontSize: 16,
    color: "grey",
    fontFamily: Fonts.AfacadRegular,
  },
  formContainer: {
    marginTop: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "grey",
    marginBottom: 8,
    fontFamily: Fonts.AfacadRegular,
  },
  dropdown: {
    backgroundColor: AllColors.lightGray,
    borderColor: AllColors.lightGray,
    borderRadius: 10,
    minHeight: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  dropdownContainer: {
    backgroundColor: AllColors.white,
    borderColor: AllColors.lightGray,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
  },
  dropdownPlaceholder: {
    color: "grey",
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.black,
  },
  saveButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: AllColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: AllColors.white,
    fontSize: 18,
    // fontFamily: Fonts.AfacadSemiBold,
  },
});

export default AboutProfileScreen;