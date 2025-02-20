import React, {useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import useConversation from '../zustand/useConversation';

const baseUrl = 'https://ricedeal.onrender.com';

function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const {messages, setMessages, selectedConversation} = useConversation();

  const sendMessage = async message => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('chat-token');
      const options = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const result = await axios.post(
        `${baseUrl}/api/v1/messages/${selectedConversation?._id}`,
        {message},
        {headers: options},
      );

      if (result) {
        setMessages([...messages, result.data.result]);
        setLoading(false);
      }

      if (result.error) throw new Error(result.error);
    } catch (error) {
      console.error('Error on sendMessage: ', error);
      Alert.alert('Error', error.message || 'Something went wrong!', [
        {text: 'OK'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {loading, sendMessage};
}

export default useSendMessage;
