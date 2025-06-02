import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Alert, ActivityIndicator, View, FlatList, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://ricedeal.onrender.com';

function useGetConversations() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('chat-token');
        if (!token) {
          throw new Error('No token found');
        }
        const result = await axios.get(`${baseUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (result.error) {
          throw new Error(result.error);
        }

        setConversations(result.data.result);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return {loading, conversations};
}

function ConversationsList() {
  const {loading, conversations} = useGetConversations();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{flex: 1, padding: 10}}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={{padding: 10, borderBottomWidth: 1}}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default ConversationsList;
