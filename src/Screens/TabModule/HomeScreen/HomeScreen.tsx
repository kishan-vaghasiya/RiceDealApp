import { NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Animated, FlatList, Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, TextInput, Modal, StyleSheet, Linking } from 'react-native';
import { styles } from './styles';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Instance } from '../../../Api/Instance';
import { GET_TRADES } from '../../../Api/Api_End_Points';
import socketServices from '../../utils/socketServices';
import { useAuthContext } from '../../../context/AuthContext';
import DealCarousel from '../../Components/DealCarousel';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HomeScreenProps {
  navigation: NavigationProp<any, any>;
}

const HomeScreen = (props: HomeScreenProps) => {
  const { options, authUser } = useAuthContext()
  const navigation = useNavigation<any>();
  const [categoriess, setCategoriess] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [latestProduct, setLatestProduct] = useState<any[]>([]);
  const [adminProduct, setAdminProduct] = useState<any[]>([]);
  const [banners, setBanners] = useState<any>([])
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any>([]);

  useEffect(() => {
    // Show subscription popup when component mounts
    setShowSubscriptionPopup(true);
    getSingleLatestProduct();
    getAdminProduct();
    getBanner();
    fetchCategories();
    socketServices.initialzeSocket(authUser?._id);
    return () => {
      socketServices.disconnectSocket();
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await Instance.get(GET_TRADES.url);
      if (response.data.success) {
        setCategoriess(response.data.result);
        setFilteredCategories(response.data.result);
      } else {
        console.error('Failed to fetch categories', response.data.msg);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSingleLatestProduct = async () => {
    await Instance.get(`/v1/products/latestProduct`).then((response) => {
      setLatestProduct(response.data.result)
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    });
  };

  const getBanner = async () => {
    await Instance.get(`/v1/banners/getAll`).then((response) => {
      setBanners(response?.data?.result);
    }).catch((error) => {
      console.log("error: ", error);
    });
  };

  const getAdminProduct = async () => {
    await Instance.get(`/v1/products/adminProducts`).then((response) => {
      setAdminProduct(response.data.result);
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    });
  };

  const handleChatNavigation = (senderId: any, item: any) => {
    navigation.navigate('ChatScreen', { userId: senderId, user: item });
  };

  const handleWhatsAppClick = () => {
    // Replace this phone number with your WhatsApp business number
    const phoneNumber = '+918277903077'; // Include country code
    const url = `whatsapp://send?phone=${phoneNumber}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // If WhatsApp is not installed, open in browser
        Linking.openURL(`https://wa.me/${phoneNumber}`);
      }
    });
  };

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleChatNavigation(item?.user?._id, item?.user)} style={styles.productContainer}>
      <Image source={{ uri: item?.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item?.name}</Text>
      <Text style={styles.productCode}>₹ {item?.price}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigation.navigate('ConcatctListWithCategory', { categoryId: item._id })}>
      <Image source={{ uri: item?.image }} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item?.name}</Text>
    </TouchableOpacity>
  );

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = categoriess.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCategories(filtered);
  };

  const handleSubscribeNow = () => {
    setShowSubscriptionPopup(false);
    props.navigation.navigate('ChoosePlan'); // Replace with your actual package screen name
  };

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <CustomHeader type="invest" screenName="Home" onPressProfilePic={() => { props.navigation.navigate('EditProfile'); }} />

      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ marginBottom: metrics.hp10 }}>
        <FlatList
          data={adminProduct}
          horizontal
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productList}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          pagingEnabled
          decelerationRate={'normal'}
          scrollEventThrottle={16}
        />

        <DealCarousel navigation={props.navigation} data={latestProduct} type={"product"} />

        <Text style={styles.sectionTitle}>Categories</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={AllColors.primary900} />
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            numColumns={2}
            renderItem={renderCategory}
            keyExtractor={(item) => item._id}
            columnWrapperStyle={styles.categoryList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* WhatsApp Icon */}
      <TouchableOpacity 
        style={popupStyles.whatsappButton}
        onPress={handleWhatsAppClick}
      >
        <Icon name="whatsapp" size={30} color="white" />
      </TouchableOpacity>

      {/* Subscription Popup Modal */}
      <Modal
        visible={showSubscriptionPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubscriptionPopup(false)}
      >
        <View style={popupStyles.modalContainer}>
          <View style={popupStyles.popupContainer}>
            <Text style={popupStyles.popupTitle}>Premium Subscription</Text>
            <Text style={popupStyles.popupText}>
              Unlock all features with our premium subscription package!
            </Text>
            <View style={popupStyles.buttonContainer}>
              <TouchableOpacity 
                style={[popupStyles.button, popupStyles.subscribeButton]} 
                onPress={handleSubscribeNow}
              >
                <Text style={popupStyles.buttonText}>Subscribe Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[popupStyles.button, popupStyles.closeButton]} 
                onPress={() => setShowSubscriptionPopup(false)}
              >
                <Text style={popupStyles.buttonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const popupStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: AllColors.primary900,
  },
  closeButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default HomeScreen;