import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, } from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { Instance } from '../../../Api/Instance';
import { useAuthContext } from '../../../context/AuthContext';
import socketServices from '../../utils/socketServices';

interface InvestScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}


const InvestScreen = (props: InvestScreenProps) => {
  const { options, authUser } = useAuthContext()
  const [users, setUsers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)


  const getAllUsers = async () => {
    return await Instance.get(`/v1/users/chat/users`, { headers: options }).then((response) => {
      setUsers(response.data.result)
      setLoading(false)
    }).catch((error: any) => {
      console.error('Error fetching users:', error)
      setLoading(false)
    })
  }


  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => { props.navigation.navigate('ChatScreen', { userId: item?._id, user: item }) }}>
      <Image source={{ uri: item?.image }} style={styles.image} resizeMode='contain' />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item?.name}</Text>
        <Text style={styles.subtitle}>{item?.email}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    socketServices.initialzeSocket(authUser?._id)
  }, [])


  useEffect(() => {
    getAllUsers()
  }, [loading])


  return (
    <View style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <CustomHeader type="back" screenName="Chat" onPressBack={() => { props.navigation.navigate('Home'); }} />
      <FlatList data={users} keyExtractor={item => item._id} renderItem={renderItem} contentContainerStyle={styles.list} />
    </View>
  );
};

export default InvestScreen;
