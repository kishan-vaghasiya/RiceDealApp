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

interface AINFYScreenProps {
  navigation: NavigationProp<any, any>;
}

const AINFYScreen = (props: AINFYScreenProps) => {
  const navigation = useNavigation();

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
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await Instance.get(GET_USER_PROFILE.url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log('User ID:', data.result._id); 
        if (data.success) {
          setUserProfile(data.result);
          setUserId(data.result._id); 
        }
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <Container
        statusBarStyle={'dark-content'}
        statusBarBackgroundColor={AllColors.white}
        backgroundColor={AllColors.white}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AllColors.primary900} />
        </View>
      </Container>
    );
  }

  const Item = ({ item }: any) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.image }} 
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.createdAt}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>₹ {item.price}</Text> 
            <TouchableOpacity style={styles.ItemViewHistory}>
              <Image
                source={Images.bin}
                style={styles.binImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Screen</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfoContainer}>
          <Image
            source={{ uri: userProfile?.image }}
            style={styles.profileImage}
          />
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
            <Image
              source={Images.additem}
              style={styles.addItemImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView >
                  <FlatList data={products} renderItem={Item} keyExtractor={(item) => item._id} />
      </ScrollView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default AINFYScreen;
