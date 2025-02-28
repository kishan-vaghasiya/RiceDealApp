import { CommonActions, NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { fontSize } from '../../../Constants/Fonts';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Instance } from '../../../Api/Instance';
import { GET_USER_PROFILE } from '../../../Api/Api_End_Points';
import axios from 'axios'; // For API call
import { useAuthContext } from '../../../context/AuthContext';
import moment from 'moment';

interface AINFYScreenProps {
  navigation: NavigationProp<any, any>;
}

const AINFYScreen = (props: AINFYScreenProps) => {
  const navigation = useNavigation();
  const { options } = useAuthContext()

  const [CurrentBtn, setCurrentBtn] = useState<string>('Positions');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]); // New state for products
  const [userId, setUserId] = useState<string>(''); // State to store the user ID



  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              props.navigation.navigate('LoginScreen');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchUserProfile = async () => {
    try {
      const response = await Instance.get(GET_USER_PROFILE.url, { headers: options });
      const data = response.data;
      console.log("data: ", data);
      setUserProfile(data.result);
      setUserId(data.result._id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("optiont: ", options);




  const fetchProducts = async (userId: string) => {
    try {
      const response = await Instance.get(`/v1/products/brand/user/${userId}`);
      if (response.data && response.data.success) {
        setProducts(response.data.result);
      } else {
        console.log('Error fetching products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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

  if (isLoading) {
    return (
      <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AllColors.primary900} />
        </View>
      </Container>
    );
  }

  const Item = ({ item }: any) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.createdAt}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>₹ {item.price}</Text>
            <TouchableOpacity style={styles.ItemViewHistory}>
              <Image source={Images.bin} style={styles.binImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Screen</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileInfoContainer}>
          <Image source={{ uri: userProfile?.image }} style={styles.profileImage} />

          <View style={styles.profileDetails}>
            <View style={styles.profileDetailRow}>
              <Text style={styles.title}>Name:{' '}</Text>
              <Text style={styles.name}>{userProfile?.name}</Text>
            </View>

            <View style={styles.profileDetailRow}>
              <Text style={styles.title}>Trade Name:{' '}</Text>
              <Text style={styles.name}>{userProfile?.trade?.name}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => { props.navigation.navigate('AddItem'); }}>
            <Image source={Images.additem} style={styles.addItemImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.title}>Your Active Plan</Text>
        <View style={styles.profileInfoContainer}>
          {/* <Image source={{ uri: userProfile?.image }} style={styles.profileImage} /> */}
          <View style={styles.profileDetails}>
            <View style={styles.profileDetailRow}>
              <Text style={styles.title}>Title: </Text>
              <Text style={styles.name}>{userProfile?.subscriptionId?.subscriptionId?.name || 'NA'}</Text>
            </View>

            <View style={styles.profileDetailRow}>
              <Text style={styles.title}>End Date: </Text>
              <Text style={styles.name}>{moment(userProfile?.subscriptionId?.endDate).format('DD-MM-YY') || 'NA'}</Text>
            </View>
          </View>

          {userProfile?.subscriptionId ?
            <TouchableOpacity style={{ borderWidth: 1, height: 45, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 5 }} onPress={() => { props.navigation.navigate('Subscribed'); }}>
              <Text style={styles.title}>View Subscriptions</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ borderWidth: 1, height: 45, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 5 }} onPress={() => { props.navigation.navigate('ChoosePlan'); }}>
              <Text style={styles.title}>Choose Plan</Text>
            </TouchableOpacity>
          }
        </View>
      </View>

      <ScrollView >
        <FlatList data={products} renderItem={Item} keyExtractor={(item) => item._id} />
      </ScrollView>

      {/* <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("ChoosePlan")}> */}
      {/* <TouchableOpacity style={{
        position: 'absolute',
        bottom: 160,
        left: 15,
        right: 15,
        backgroundColor: AllColors.primary900,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }} onPress={() => navigation.navigate("ChoosePlan")}>
        <Text style={styles.logoutText}>Choose Plan</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default AINFYScreen;
