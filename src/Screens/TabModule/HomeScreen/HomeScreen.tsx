import { NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import axios from 'axios';
import { Instance } from '../../../Api/Instance';
import { GET_TRADES } from '../../../Api/Api_End_Points';
import socketServices from '../../utils/socketServices';
import { useAuthContext } from '../../../context/AuthContext';
import DealCarousel from '../../Components/DealCarousel';

interface HomeScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const products = [
  {
    id: '1',
    name: 'V R M apple (53 par kg)',
    code: '7019536026',
    image:
      'https://e7.pngegg.com/pngimages/345/524/png-clipart-cooked-rice-basmati-grocery-store-gunny-sack-rice-bags-food-supermarket.png',
  },
  {
    id: '2',
    name: 'V R M apple (53 par kg)',
    code: '7019536026',
    image:
      'https://e7.pngegg.com/pngimages/345/524/png-clipart-cooked-rice-basmati-grocery-store-gunny-sack-rice-bags-food-supermarket.png',
  },
  {
    id: '3',
    name: 'V R M apple (53 par kg)',
    code: '7019536026',
    image:
      'https://e7.pngegg.com/pngimages/345/524/png-clipart-cooked-rice-basmati-grocery-store-gunny-sack-rice-bags-food-supermarket.png',
  },
  {
    id: '4',
    name: 'V R M apple (53 par kg)',
    code: '7019536426',
    image:
      'https://e7.pngegg.com/pngimages/345/524/png-clipart-cooked-rice-basmati-grocery-store-gunny-sack-rice-bags-food-supermarket.png',
  },
  {
    id: '5',
    name: 'V R M apple (53 par kg)',
    code: '7079536026',
    image:
      'https://e7.pngegg.com/pngimages/345/524/png-clipart-cooked-rice-basmati-grocery-store-gunny-sack-rice-bags-food-supermarket.png',
  },
];


const HomeScreen = (props: HomeScreenProps) => {
  const { options, authUser } = useAuthContext()
  const navigation = useNavigation();
  const [categoriess, setCategoriess] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [latestProduct, setLatestProduct] = useState<any[]>([]);
  const [adminProduct, setAdminProduct] = useState<any[]>([]);

  const getSingleLatestProduct = async () => {
    await Instance.get(`/v1/products/latestProduct`).then((response) => {
      console.log("response: ", response.data.result)
      setLatestProduct(response.data.result)
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    })
  }

  const getAdminProduct = async () => {
    await Instance.get(`/v1/products/adminProducts`).then((response) => {
      console.log("response: ", response.data.result)
      setAdminProduct(response.data.result)
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    })
  }

  useEffect(() => {
    getSingleLatestProduct()
    getAdminProduct()
    const fetchCategories = async () => {
      try {
        const response = await Instance.get(GET_TRADES.url);
        if (response.data.success) {
          setCategoriess(response.data.result);
        } else {
          console.error('Failed to fetch categories', response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    socketServices.initialzeSocket(authUser?._id)

    return () => {
      socketServices.disconnectSocket()
    }
  }, [])

  const handleChatNavigation = (senderId: any, item: any) => {
    navigation.navigate('ChatScreen', { userId: senderId, user: item })
  }

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleChatNavigation(item?.user?._id, item?.user)} style={styles.productContainer}>
      <Image source={{ uri: item?.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item?.name}</Text>
      <Text style={styles.productCode}>₹ {item?.price}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigation.navigate('Chat', { categoryId: item._id })}>
      {/* <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigation.navigate('RiseListScreen', { categoryId: item._id })}> */}
      <Image source={{ uri: item?.image }} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item?.name}</Text>
    </TouchableOpacity>
  );


  const scrollX = React.useRef(new Animated.Value(0)).current;

  // console.log("latestProduct:", latestProduct);

  return (

    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader type="invest" screenName="Home" onPressProfilePic={() => { props.navigation.navigate('EditProfile'); }} />
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ marginBottom: metrics.hp10 }}>
        {/* Product Carousel */}
        <FlatList
          data={adminProduct}
          horizontal
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productList}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          pagingEnabled
          decelerationRate={'normal'}
          scrollEventThrottle={16}
        />

        <TouchableOpacity onPress={() => props.navigation.navigate('DealPostList')}>
          {/* <Image source={Images.Deal} style={styles.banner} /> */}
          <Image source={{ uri: latestProduct[0]?.image }} style={styles.banner} />
        </TouchableOpacity>
        {/* <DealCarousel navigation={props.navigation} data={latestProduct} /> */}

        <Text style={styles.sectionTitle}>Categories</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={AllColors.primary900} />
          </View>
        ) : (
          <FlatList
            data={categoriess}
            numColumns={2}
            renderItem={renderCategory}
            keyExtractor={(item) => item._id}
            columnWrapperStyle={styles.categoryList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;
