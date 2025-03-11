import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, } from 'react-native';
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
}


const InvestScreen = (props: InvestScreenProps) => {
  const { options, authUser } = useAuthContext()
  const [users, setUsers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [msgRefresh, setMsgRefresh] = useState<boolean>(false)


  const getAllUsers = async () => {
    return await Instance.get(`/v1/users/chat/users`, { headers: options }).then((response) => {
      setUsers(response.data.result)
      // console.log("response: ", response?.data);

      setLoading(false)
    }).catch((error: any) => {
      console.error('Error fetching users:', error)
      setLoading(false)
    })
  }

  useEffect(() => {

    socketServices.on('msg', () => {
      // console.log(" ================================== received message ============================================== ");
      getAllUsers()
    });

    return () => {
      socketServices.removeListener('msg');
    };
  }, []);

  const handleChatNavigation = (senderId: any, item: any) => {
    // socketServices.emit('seenMessages', { userId: authUser._id, senderId });
    props.navigation.navigate('ChatScreen', { userId: senderId, user: item })
  }

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item?._id, item)}>
      <Image source={{ uri: item?.image }} style={styles.image} resizeMode='contain' />

      <View style={styles.textContainer}>
        {/* User Name and Unread Count Badge */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{item?.name}</Text>

          {item?.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <Text style={styles.subtitle}>{item?.lastMessage}</Text>
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
  }, [loading, refreshing, msgRefresh])


  return (
    <View style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <CustomHeader type="back" screenName="Chat" onPressBack={() => { props.navigation.navigate('Home'); }} />
      <FlatList data={users} keyExtractor={item => item._id} renderItem={renderItem} contentContainerStyle={styles.list} refreshing={refreshing} onRefresh={handleRefresh} />
    </View>
  );
};

export default InvestScreen;
