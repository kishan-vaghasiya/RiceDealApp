import { NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Animated, FlatList, Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, TextInput } from 'react-native';
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

interface HomeScreenProps {
  navigation: NavigationProp<any, any>;
}


const HomeScreen = (props: HomeScreenProps) => {
  const { options, authUser } = useAuthContext()
  const navigation = useNavigation();
  const [categoriess, setCategoriess] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [latestProduct, setLatestProduct] = useState<any[]>([]);
  const [adminProduct, setAdminProduct] = useState<any[]>([]);
  const [banners, setBanners] = useState<any>([])

  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any>([]);

  const getSingleLatestProduct = async () => {
    await Instance.get(`/v1/products/latestProduct`).then((response) => {
      setLatestProduct(response.data.result)
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    })
  }

  const getBanner = async () => {
    await Instance.get(`/v1/banners/getAll`).then((response) => {
      setBanners(response?.data?.result)
      console.log("response: ", response?.data);

    }).catch((error) => {
      console.log("error: ", error);
    })
  }

  const getAdminProduct = async () => {
    await Instance.get(`/v1/products/adminProducts`).then((response) => {
      setAdminProduct(response.data.result)
    }).catch((error: any) => {
      console.error('Error fetching latest product:', error);
    })
  }

  useEffect(() => {
    getSingleLatestProduct()
    getAdminProduct()
    getBanner()
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
    <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigation.navigate('ConcatctListWithCategory', { categoryId: item._id })}>
      {/* <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigation.navigate('RiseListScreen', { categoryId: item._id })}> */}
      <Image source={{ uri: item?.image }} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item?.name}</Text>
    </TouchableOpacity>
  );
  const scrollX = React.useRef(new Animated.Value(0)).current;

  // console.log("latestProduct:", latestProduct);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = categoriess.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCategories(filtered);
  };


  // console.log("banner: ", banners);


  return (

    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>

      <CustomHeader type="invest" screenName="Home" onPressProfilePic={() => { props.navigation.navigate('EditProfile'); }} />


      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ marginBottom: metrics.hp10 }}>
        {/* <DealCarousel navigation={props.navigation} data={banners} /> */}

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

        {/* <TouchableOpacity onPress={() => props.navigation.navigate('DealPostList')}>
          <Image source={{ uri: latestProduct[0]?.image }} style={styles.banner} />
        </TouchableOpacity> */}
        {/* <View style={{ borderWidth: 1, borderColor: 'red' }}> */}

        <DealCarousel navigation={props.navigation} data={latestProduct} type={"product"} />
        {/* </View> */}

        {/* <View style={{ width: '95%', marginHorizontal: '2.5%' }}>
          <TextInput value={search} onChangeText={handleSearch} placeholder="Search category..." style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 5, marginTop: 10 }} />
        </View> */}
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
    </Container>
  );
};

export default HomeScreen;
