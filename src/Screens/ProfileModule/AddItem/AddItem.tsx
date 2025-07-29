import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import axios from 'axios';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import {AllColors} from '../../../Constants/COLORS';
import {Container} from '../../../Components/Container/Container';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import metrics from '../../../Constants/Metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Instance} from '../../../Api/Instance';
import {ADD_ITEM, GET_USER_PROFILE, DELETE_ITEM} from '../../../Api/Api_End_Points';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import { useAuthContext } from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {format} from 'date-fns';

const {width, height} = Dimensions.get('window');

const AddItem: React.FC = (props: any) => {
  const { options } = useAuthContext();
  const [brandName, setBrandName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [products, setProducts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(height * 0.3))[0];
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          setToastMessage('Failed to select image');
          setToastType('error');
        } else {
          if (response.assets && response.assets.length > 0) {
            setImageUri(response.assets[0].uri);
          }
        }
      },
    );
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await Instance.get(GET_USER_PROFILE.url, { headers: options });
      const data = response.data;
      setUserProfile(data.result);
      setUserId(data.result._id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setToastMessage('Failed to load profile');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await Instance.get(`/v1/products/brand/user/${userId}`);
      if (response.data && response.data.success) {
        setProducts(response.data.result);
      } else {
        console.log('Error fetching products:', response.data.message);
        setToastMessage('Failed to load products');
        setToastType('error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setToastMessage('Network error loading products');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProducts(userId);
    }
  }, [userId]);

  const handleAddItem = async () => {
    if (!brandName.trim()) {
      setToastMessage('Please enter a brand name');
      setToastType('error');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      setToastMessage('Please enter a valid price');
      setToastType('error');
      return;
    }

    if (!imageUri) {
      setToastMessage('Please select an image');
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

    try {
      const response = await Instance.post(ADD_ITEM.url, formData, {
        headers: {
          ...options,
          'Content-Type': 'multipart/form-data',
        },
      });

      setToastMessage('Item added successfully!');
      setToastType('success');
      setBrandName('');
      setPrice('');
      setImageUri('');
      
      if (userId) {
        await fetchProducts(userId);
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        setToastMessage(
          `Error: ${error.response?.data.message || 'Something went wrong'}`,
        );
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

  const handleDeleteItem = async (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setDeleteLoading(productId);
              const response = await Instance.delete(
                `${DELETE_ITEM.url}/${productId}`,
                { headers: options }
              );
              
              if (response.data && response.data.success) {
                setToastMessage('Product deleted successfully');
                setToastType('success');
                if (userId) {
                  await fetchProducts(userId);
                }
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              setToastMessage('Failed to delete product');
              setToastType('error');
            } finally {
              setDeleteLoading(null);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const Item = ({ item }: any) => {
    const formattedDate = format(new Date(item.createdAt), 'MMM dd, yyyy');
    
    return (
      <Animated.View 
        style={[
          styles.itemContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <View style={styles.dateContainer}>
              <Icon name="event" size={14} color={AllColors.grey} />
              <Text style={styles.itemSubtitle}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>₹ {item.price}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteItem(item._id)}
              disabled={deleteLoading === item._id}
            >
              {deleteLoading === item._id ? (
                <ActivityIndicator size="small" color={AllColors.grey} />
              ) : (
                <Icon name="delete" size={20} color={AllColors.error} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <CustomHeader
            type="back"
            screenName="Add Product"
            onPressBack={() => props.navigation.goBack()}
          />

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View 
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Image Upload Section */}
              <View style={styles.imageSection}>
                <TouchableOpacity 
                  style={styles.imageUploadContainer}
                  onPress={handleImagePick}
                  activeOpacity={0.7}
                >
                  {imageUri ? (
                    <ImageBackground
                      source={{ uri: imageUri }}
                      style={styles.imageBackground}
                      imageStyle={styles.imageStyle}
                    >
                      <View style={styles.overlay}>
                        <View style={styles.editIconContainer}>
                          <Icon name="edit" size={24} color={AllColors.white} />
                        </View>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Icon name="add-a-photo" size={48} color={AllColors.primary800} />
                      <Text style={styles.uploadText}>Tap to upload product image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Product Details</Text>
                
                <View style={styles.inputContainer}>
                  <Icon name="local-offer" size={20} color={AllColors.grey} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Brand Name"
                    placeholderTextColor={AllColors.grey}
                    value={brandName}
                    onChangeText={setBrandName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="attach-money" size={20} color={AllColors.grey} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Price"
                    placeholderTextColor={AllColors.grey}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleAddItem}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={AllColors.white} />
                  ) : (
                    <Text style={styles.buttonText}>ADD PRODUCT</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Products List Section */}
              <TouchableOpacity 
                style={styles.toggleSection} 
                onPress={toggleExpand}
                activeOpacity={0.8}
              >
                <Text style={styles.sectionTitle}>Your Products ({products.length})</Text>
                <Icon 
                  name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                  size={24} 
                  color={AllColors.primary800} 
                />
              </TouchableOpacity>

              {isExpanded && (
                <FlatList 
                  data={products}
                  renderItem={Item}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContainer}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Icon name="inventory" size={48} color={AllColors.grey} />
                      <Text style={styles.emptyText}>No products added yet</Text>
                    </View>
                  }
                />
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <ToastMessage type={toastType} message={toastMessage} />
    </Container>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  imageSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  imageUploadContainer: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: AllColors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: AllColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  editIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    marginTop: 10,
    fontSize: fontSize(14),
    color: AllColors.primary800,
    fontFamily: Fonts.AfacadRegular,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: fontSize(18),
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AllColors.white,
    borderWidth: 1,
    borderColor: AllColors.lightGrey,
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 1,
    shadowColor: AllColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: fontSize(16),
    color: AllColors.black,
    fontFamily: Fonts.AfacadRegular,
    height: '100%',
  },
  button: {
    backgroundColor: AllColors.primary800,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: AllColors.primary800,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: AllColors.white,
    fontSize: fontSize(16),
    fontFamily: Fonts.AfacadBold,
    letterSpacing: 0.5,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    backgroundColor: AllColors.white,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: AllColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: fontSize(16),
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSubtitle: {
    fontSize: fontSize(12),
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.grey,
    marginLeft: 5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: fontSize(16),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary900,
    marginRight: 10,
  },
  actionButton: {
    padding: 5,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: fontSize(14),
    color: AllColors.grey,
    fontFamily: Fonts.AfacadRegular,
    marginTop: 10,
  },
});

export default AddItem;