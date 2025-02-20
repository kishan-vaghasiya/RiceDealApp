import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, 
  ActivityIndicator
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { AllColors } from '../../../Constants/COLORS';
import { Container } from '../../../Components/Container/Container';
import { Fonts } from '../../../Constants/Fonts';
import metrics from '../../../Constants/Metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Instance } from '../../../Api/Instance';
import { ADD_ITEM } from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';

const AddItem: React.FC = (props: any) => {
  const [brandName, setBrandName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [toastMessage, setToastMessage] = useState<string>(''); 
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      (response: ImagePickerResponse) => { 
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            setImageUri(response.assets[0].uri); 
          }
        }
      }
    );
  };

  const handleAddItem = async () => {
    const numericPrice = parseFloat(price);
  
    if (isNaN(numericPrice)) {
      setToastMessage('Please enter a valid price'); // Show toast message for invalid price
      setToastType('error');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', brandName);
    formData.append('price', numericPrice.toString());
  
    if (imageUri) {
      const fileExtension = imageUri.split('.').pop();
      const image = {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image.${fileExtension}`,
      };
      formData.append('image', image);
    }
  
    const token = await AsyncStorage.getItem('userToken');
  
    try {
      const response = await Instance.post(
        ADD_ITEM.url,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Item added successfully', response.data);
      setToastMessage('Item added successfully!');
      setToastType('success');
      setBrandName('');
      setPrice('');
      setImageUri('');
      props.navigation.navigate('TabNavigator');  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        setToastMessage(`Error: ${error.response?.data.message || 'Something went wrong'}`);
        setToastType('error');
      } else {
        console.error('Unexpected Error:', error);
        setToastMessage('Unexpected error occurred. Please try again.');
        setToastType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <CustomHeader
            type="back"
            screenName="Add Item"
            onPressBack={() => {
              props.navigation.goBack();
            }}
          />
          <ImageBackground
            source={imageUri ? { uri: imageUri } : { uri: 'https://img.freepik.com/free-photo/top-view-raw-rice-inside-bag-plate-grey-surface_140725-90598.jpg?semt=ais_hybrid' }}
            imageStyle={{ width: '100%', height: '100%' }}
            resizeMode="stretch"
            style={styles.imageBackground}>
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.addIconContainer} onPress={handleImagePick}>
                <Text style={styles.addIcon}>+</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <KeyboardAvoidingView
            style={styles.formContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TextInput
              style={styles.input}
              placeholder="Brand Name"
              placeholderTextColor="#777"
              value={brandName}
              onChangeText={text => setBrandName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#777"
              value={price}
              onChangeText={text => setPrice(text)}
              keyboardType="numeric"
            />
             <TouchableOpacity style={styles.button} onPress={handleAddItem} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={AllColors.white} /> 
              ) : (
                <Text style={styles.buttonText}>ADD</Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      <ToastMessage type={toastType} message={toastMessage} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {},
  imageBackground: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.hp2,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconContainer: {
    width: 71,
    height: 71,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 50,
    color: AllColors.primary800,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: Fonts.AfacadSemibold,
  },
  button: {
    backgroundColor: AllColors.primary800,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.AfacadBold,
  },
});

export default AddItem;
