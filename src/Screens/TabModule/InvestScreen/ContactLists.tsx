import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { Instance } from '../../../Api/Instance';
import { useAuthContext } from '../../../context/AuthContext';
import socketServices from '../../utils/socketServices';
import moment from 'moment';

interface InvestScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
  route: any
}

const ContactLists = (props: InvestScreenProps) => {
  const { options, authUser } = useAuthContext()
  const [users, setUsers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const categoryId = props?.route?.params?.categoryId

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [msgRefresh, setMsgRefresh] = useState<boolean>(false)

  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  const [filters, setFilters] = useState<any>({
    name: '',
    mobile: '',
    shopName: '',
    trade: '',
    state: '',
    city: '',
    country: '',
    address: ''
  });




  /* const getAllUsers = async () => {
    return await Instance.get(`/v1/users/chat/users`, { params: { tradeId: categoryId }, headers: options }).then((response) => {
      setUsers(response.data.result)
      setLoading(false)
    }).catch((error: any) => {
      console.error('Error fetching users:', error)
      setLoading(false)
    })
  } */
  const getAllUsers = async () => {
    try {
      const params = {
        tradeId: categoryId,
        ...filters // spread filters into query params
      };

      const response = await Instance.get(`/v1/users/chat/users`, {
        params,
        headers: options
      });

      setUsers(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };


  useEffect(() => {

    socketServices.on('msg', () => {
      getAllUsers()
    });

    return () => {
      socketServices.removeListener('msg');
    };
  }, [categoryId]);

  const handleChatNavigation = (senderId: any, item: any) => {
    // socketServices.emit('seenMessages', { userId: authUser._id, senderId });
    props.navigation.navigate('ChatScreen', { userId: senderId, user: item })
  }

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item?._id, item)}>
      <Image source={{ uri: item?.image }} style={styles.image} resizeMode='contain' />

      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{item?.name}</Text>

          {item?.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <Text style={styles.subtitle}>City: {item?.city}</Text>
        <Text style={styles.subtitle}>State: {item?.state}</Text>
        <Text style={styles.subtitle}>Trade: {item?.tradeDetails?.name}</Text>
        <Text style={styles.subtitle}>Last Message: {item?.lastMessage}</Text>
        <Text style={styles.subtitle}>{moment(item?.lastMessageTime).format("hh:mm a DD/MM/YY")}</Text>
      </View>
    </TouchableOpacity>
  );


  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    getAllUsers()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  useFocusEffect(
    useCallback(() => {
      getAllUsers(); // Call API whenever the screen is focused

      return () => {
        // Cleanup (optional)
      };
    }, [refreshing]) // Dependencies to re-run if `refreshing` changes
  );


  useEffect(() => {
    getAllUsers()
  }, [loading, refreshing, msgRefresh, categoryId, filters])

  // console.log("users", users);

  const handleClearFunction = () => {
    setFilters({
      name: '',
      mobile: '',
      shopName: '',
      trade: '',
      state: '',
      city: '',
      country: '',
      address: ''
    })
    setIsFilterVisible(false)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <CustomHeader type="back" screenName="Chat" onPressBack={() => { props.navigation.navigate('Home'); }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
            <TextInput placeholder="Name" value={filters.name} onChangeText={text => setFilters((prev: any) => ({ ...prev, name: text }))} style={styles.input} />
            <TextInput placeholder="Mobile" value={filters.mobile} onChangeText={text => setFilters((prev: any) => ({ ...prev, mobile: text }))} style={styles.input} keyboardType="numeric" />
          </View>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)} style={{ padding: 8 }}>
            {/* <Text style={{ color: '#007AFF', fontWeight: '600' }}>Filter</Text> */}
            <Image source={require('../../../Assets/Image/Components/filter.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>

        <FlatList data={users} keyExtractor={item => item._id} renderItem={renderItem} contentContainerStyle={styles.list} refreshing={refreshing} onRefresh={handleRefresh} />
      </SafeAreaView>

      {isFilterVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={{ padding: 10 }}>
              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput placeholder="Name" value={filters.name} onChangeText={text => setFilters(prev => ({ ...prev, name: text }))} style={styles.input} />
                <TextInput placeholder="Mobile" value={filters.mobile} onChangeText={text => setFilters(prev => ({ ...prev, mobile: text }))} style={styles.input} keyboardType="numeric" />
              </View> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <TextInput placeholder="Shop Name" value={filters.shopName} onChangeText={text => setFilters((prev: any) => ({ ...prev, shopName: text }))} style={styles.input} />
                <TextInput placeholder="Trade" value={filters.trade} onChangeText={text => setFilters((prev: any) => ({ ...prev, trade: text }))} style={styles.input} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput placeholder="State" value={filters.state} onChangeText={text => setFilters((prev: any) => ({ ...prev, state: text }))} style={styles.input} />
                <TextInput placeholder="City" value={filters.city} onChangeText={text => setFilters((prev: any) => ({ ...prev, city: text }))} style={styles.input} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <TextInput placeholder="Country" value={filters.country} onChangeText={text => setFilters((prev: any) => ({ ...prev, country: text }))} style={styles.input} />
                <TextInput placeholder="Address" value={filters.address} onChangeText={text => setFilters((prev: any) => ({ ...prev, address: text }))} style={styles.input} />
              </View>
              <TouchableOpacity onPress={() => { setIsFilterVisible(false); getAllUsers(); }} style={styles.filterButton}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsFilterVisible(false)} style={[styles.filterButton, { backgroundColor: '#ccc', marginTop: 10 }]}>
                <Text style={{ color: 'black', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

    </View>
  );
};

export default ContactLists;
