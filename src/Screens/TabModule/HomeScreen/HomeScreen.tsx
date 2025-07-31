import {NavigationProp} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Modal,
  StyleSheet,
  Linking,
  Dimensions,
  Easing,
} from 'react-native';
import {styles} from './styles';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import {useNavigation} from '@react-navigation/native';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {Instance} from '../../../Api/Instance';
import {GET_TRADES} from '../../../Api/Api_End_Points';
import socketServices from '../../utils/socketServices';
import {useAuthContext} from '../../../context/AuthContext';
import DealCarousel from '../../Components/DealCarousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import Lottie from 'lottie-react-native';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');
interface HomeScreenProps {
  navigation: NavigationProp<any, any>;
}
const HomeScreen = (props: HomeScreenProps) => {
  const {options, authUser} = useAuthContext();
  const navigation = useNavigation<any>();
  const [categoriess, setCategoriess] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [latestProduct, setLatestProduct] = useState<any[]>([]);
  const [adminProduct, setAdminProduct] = useState<any[]>([]);
  const [banners, setBanners] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<Lottie>(null);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();

    // Show subscription popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowSubscriptionPopup(true);
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    }, 3000);

    getSingleLatestProduct();
    getAdminProduct();
    getBanner();
    fetchCategories();
    socketServices.initialzeSocket(authUser?._id);

    return () => {
      clearTimeout(popupTimer);
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
    await Instance.get(`/v1/products/latestProduct`)
      .then(response => {
        setLatestProduct(response.data.result);
      })
      .catch((error: any) => {
        console.error('Error fetching latest product:', error);
      });
  };

  const getBanner = async () => {
    await Instance.get(`/v1/banners/getAll`)
      .then(response => {
        console.log(response, 'this is bannnerData +++++++++++++++++++');
        setBanners(response?.data?.result);
      })
      .catch(error => {
        console.log('error: ', error);
      });
  };

  const getAdminProduct = async () => {
    await Instance.get(`/v1/products/adminProducts`)
      .then(response => {
        setAdminProduct(response.data.result);
      })
      .catch((error: any) => {
        console.error('Error fetching latest product:', error);
      });
  };

  const handleChatNavigation = (senderId: any, item: any) => {
    navigation.navigate('ChatScreen', {userId: senderId, user: item});
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '918277903077';
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://wa.me/${phoneNumber}`);
        }
      })
      .catch(err => {
        console.error('Error opening WhatsApp:', err);
      });
  };

  const renderProduct = ({item, index}: any) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{transform: [{scale}]}}>
        <TouchableOpacity
          onPress={() => handleChatNavigation(item?.user?._id, item?.user)}
          style={[styles.productContainer, enhancedStyles.productCard]}>
          <LinearGradient
            colors={['#f5f7fa', '#c3cfe2']}
            style={enhancedStyles.productGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Image
              source={{uri: item?.image}}
              style={[styles.productImage, enhancedStyles.productImage]}
              resizeMode="cover"
            />
            <View style={enhancedStyles.productInfoContainer}>
              <Text
                style={[styles.productName, enhancedStyles.productName]}
                numberOfLines={1}>
                {item?.name}
              </Text>
              <View style={enhancedStyles.priceContainer}>
                <Text style={[styles.productCode, enhancedStyles.productPrice]}>
                  ₹{item?.price}
                </Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={AllColors.primary900}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCategory = ({item, index}: any) => {
    const rotate = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          enhancedStyles.categoryCardWrapper,
          {opacity: fadeAnim, transform: [{translateY: translateYAnim}]},
        ]}>
        <TouchableOpacity
          style={[
            enhancedStyles.categoryCard,
            {backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff'},
          ]}
          onPress={() =>
            props.navigation.navigate('ConcatctListWithCategory', {
              categoryId: item._id,
            })
          }
          activeOpacity={0.7}>
          <Animated.View
            style={[
              enhancedStyles.categoryIconWrapper,
              {transform: [{rotate}]},
            ]}>
            <Image
              source={{uri: item?.image}}
              style={enhancedStyles.categoryImage}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={enhancedStyles.categoryText}>{item?.name}</Text>
          <View style={enhancedStyles.categoryBadge}>
            <Text style={enhancedStyles.badgeText}>New</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = categoriess.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCategories(filtered);
  };

  const handleSubscribeNow = () => {
    setShowSubscriptionPopup(false);
    props.navigation.navigate('ChoosePlan');
  };

  const renderBannerIndicator = () => {
    return (
      <View style={enhancedStyles.indicatorContainer}>
        {adminProduct.map((_, index) => (
          <View
            key={index}
            style={[
              enhancedStyles.indicator,
              index === activeBannerIndex
                ? enhancedStyles.activeIndicator
                : enhancedStyles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={'#f8f9fa'}>
      <CustomHeader
        type="invest"
        screenName="Home"
        onPressProfilePic={() => {
          props.navigation.navigate('ProfileScreen');
        }}
      />

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{marginBottom: metrics.hp10}}>
        {/* Search Bar */}
        <Animated.View
          style={[
            enhancedStyles.searchContainer,
            {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
          ]}>
          <Ionicons
            name="search"
            size={20}
            color="#6c757d"
            style={enhancedStyles.searchIcon}
          />
          <TextInput
            placeholder="Search categories..."
            placeholderTextColor="#6c757d"
            style={enhancedStyles.searchInput}
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#6c757d" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Featured Products Carousel */}
        <View style={enhancedStyles.sectionContainer}>
          <Text style={enhancedStyles.sectionTitle}>Featured Products</Text>
          <View style={{height: 200}}>
            <Swiper
              autoplay
              loop
              showsPagination
              dotStyle={{backgroundColor: 'lightgray'}}
              activeDotStyle={{backgroundColor: 'black'}}>
              {banners.map((banner: any, index: any) => (
                <View key={banner._id} style={{flex: 1}}>
                  <Image
                    source={{uri: banner.image}}
                    style={{
                      width: width,
                      height: 150,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          </View>

          {renderBannerIndicator()}
        </View>

        {/* Latest Deals */}
        <View style={enhancedStyles.sectionContainer}>
          <View style={enhancedStyles.sectionHeader}>
            <Text style={enhancedStyles.sectionTitle}>Latest Deals</Text>
            <TouchableOpacity>
              <Text style={enhancedStyles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <DealCarousel
            navigation={props.navigation}
            data={latestProduct}
            type={'product'}
          />
        </View>

        {/* Categories Section */}
        <View style={enhancedStyles.sectionContainer}>
          <Text style={enhancedStyles.sectionTitle}>Browse Categories</Text>
          {loading ? (
            <View style={enhancedStyles.loaderContainer}>
              <ActivityIndicator size="large" color={AllColors.primary900} />
            </View>
          ) : (
            <FlatList
              data={filteredCategories}
              numColumns={2}
              renderItem={renderCategory}
              keyExtractor={item => item._id}
              columnWrapperStyle={enhancedStyles.categoryList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{paddingBottom: 20}}
            />
          )}
        </View>

        {/* Promo Banner */}
        <TouchableOpacity
          style={enhancedStyles.promoBanner}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={enhancedStyles.promoGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={enhancedStyles.promoContent}>
              <View>
                <Text style={enhancedStyles.promoTitle}>Special Offer</Text>
                <Text style={enhancedStyles.promoSubtitle}>
                  Get 20% off on first purchase
                </Text>
              </View>
              <MaterialIcons name="local-offer" size={40} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* WhatsApp Floating Button */}
      <Animated.View
        style={[
          enhancedStyles.whatsappButton,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <TouchableOpacity onPress={handleWhatsAppClick} activeOpacity={0.8}>
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            style={enhancedStyles.whatsappGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Icon name="whatsapp" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Subscription Popup Modal */}
      <Modal
        visible={showSubscriptionPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubscriptionPopup(false)}>
        <BlurView
          style={enhancedStyles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <View style={enhancedStyles.modalContainer}>
            <View style={enhancedStyles.popupContainer}>
              {/* <Lottie
                ref={lottieRef}
                source={require('../../../assets/animations/premium.json')}
                autoPlay={false}
                loop={false}
                style={enhancedStyles.lottieAnimation}
              /> */}
              <Text style={enhancedStyles.popupTitle}>
                Unlock Premium Features
              </Text>
              <Text style={enhancedStyles.popupText}>
                Get access to exclusive content, advanced features, and priority
                support with our premium subscription.
              </Text>

              <View style={enhancedStyles.featureList}>
                <View style={enhancedStyles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4BB543" />
                  <Text style={enhancedStyles.featureText}>
                    Ad-free experience
                  </Text>
                </View>
                <View style={enhancedStyles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4BB543" />
                  <Text style={enhancedStyles.featureText}>
                    Exclusive content
                  </Text>
                </View>
                <View style={enhancedStyles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4BB543" />
                  <Text style={enhancedStyles.featureText}>
                    Priority support
                  </Text>
                </View>
              </View>

              <View style={enhancedStyles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    enhancedStyles.button,
                    enhancedStyles.subscribeButton,
                  ]}
                  onPress={handleSubscribeNow}
                  activeOpacity={0.7}>
                  <Text style={enhancedStyles.buttonText}>Subscribe Now</Text>
                  <Text style={enhancedStyles.priceText}>₹299/month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[enhancedStyles.button, enhancedStyles.closeButton]}
                  onPress={() => setShowSubscriptionPopup(false)}
                  activeOpacity={0.7}>
                  <Text style={[enhancedStyles.buttonText, {color: '#495057'}]}>
                    Maybe Later
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </Container>
  );
};

const enhancedStyles = StyleSheet.create({
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    // paddingVertical: 5,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation: 3,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#495057',
    fontFamily: 'Roboto-Regular',
  },

  // Section Styles
  sectionContainer: {
  
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'Roboto-Bold',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 14,
    color: AllColors.primary900,
    fontFamily: 'Roboto-Medium',
  },

  // Product Card Styles
  productCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    width: width * 0.8,
    height: width * 0.6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  productImage: {
    height: '70%',
    borderRadius: 10,
  },
  productInfoContainer: {
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    fontFamily: 'Roboto-Medium',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: AllColors.primary900,
    fontFamily: 'Roboto-Bold',
  },
  productList: {
    paddingLeft: 15,
    paddingBottom: 10,
  },

  // Category Styles
  categoryCardWrapper: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
    marginTop: 5,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: AllColors.primary900,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  categoryList: {
    justifyContent: 'space-between',
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    height: 120,
  },
  promoGradient: {
    flex: 1,
    padding: 20,
  },
  promoContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Roboto-Medium',
    opacity: 0.9,
  },

  // WhatsApp Button
  whatsappButton: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    zIndex: 999,
  },
  whatsappGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  // Modal Styles
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
    marginBottom: -30,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
    lineHeight: 22,
    fontFamily: 'Roboto-Regular',
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#495057',
    fontFamily: 'Roboto-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButton: {
    backgroundColor: AllColors.primary900,
  },
  closeButton: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  priceText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 3,
    fontFamily: 'Roboto-Regular',
  },

  // Indicator Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: AllColors.primary900,
    width: 12,
  },
  inactiveIndicator: {
    backgroundColor: '#adb5bd',
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});

export default HomeScreen;
