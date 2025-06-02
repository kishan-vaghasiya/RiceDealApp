import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityIndicator, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useConversation from '../zustand/useConversation';

const baseUrl = 'https://ricedeal.onrender.com';

function useGetMessages() {
    const options = {
        Authorization: `Bearer ${localStorage.getItem("chat-token")}`, 
        "Content-Type": "application/json",
    };

    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const getMessage = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("chat-token");
            const result = await axios.get(`${baseUrl}/api/v1/messages/${selectedConversation?._id}`, {
                headers: { ...options, Authorization: `Bearer ${token}` }
            });
            if (result.error) throw new Error(result.message);

            setMessages(result.data.result?.messages);
            setLoading(false);
        } catch (error) {
            setMessages([]);
            setLoading(false);

            // Replacing Toast with Alert
            Alert.alert(
                'Error',  // Title of the alert
                error.message || 'Something went wrong!',  // Error message
                [{ text: 'OK' }]  // Button for closing the alert
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedConversation?._id) getMessage();
    }, [selectedConversation?._id, setMessages]);
    
    return { messages, loading };
}

export default useGetMessages;
