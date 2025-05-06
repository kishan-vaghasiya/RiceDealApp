import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image, Linking } from 'react-native';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { AllColors } from '../../../Constants/COLORS';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { Container } from '../../../Components/Container/Container';
import { Images } from '../../../Assets/Images';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { Fonts } from '../../../Constants/Fonts';
import { useAuthContext } from '../../../context/AuthContext';
import socketServices from '../../utils/socketServices';
import moment from 'moment';

interface ChatScreenProps {
    navigation: NavigationProp<any, any>;
}

interface Message {
    _id: string;
    message?: string;
    sender: string;
    receiver: string;
    imageUri?: string;
    createdAt: string;
}

const ChatScreenWithCategory: React.FC<ChatScreenProps> = (props) => {
    const route = useRoute<any>();
    const { userId, user } = route.params;
    const { authUser } = useAuthContext();

    // console.log("authUser", authUser);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');

    // Format time for UI
    const formatTime = (date: Date): string => {
        const hours = date?.getHours();
        const minutes = date?.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const minute = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour12}:${minute} ${ampm}`;
    };

    useEffect(() => {
        if (userId && authUser) {
            const roomId = [authUser._id, userId].sort().join('_');

            // Connect socket & join room
            socketServices.initialzeSocket();
            socketServices.emit('join_room', { userId: authUser._id, receiverId: userId });

            // Load previous messages
            socketServices.on('loadMessages', (loadedMessages: Message[]) => {
                console.log('Messages loaded:', loadedMessages);
                setMessages(loadedMessages);
            });
            socketServices.emit('seenMessages', { userId: authUser._id, senderId: userId });

            return () => {
                socketServices.removeListener('loadMessages');
                socketServices.removeListener('join_room');
                socketServices.removeListener('seenMessages');
            };
        }
    }, [userId]);



    useEffect(() => {
        if (authUser) {
            socketServices.on('receiveMessage', (message: Message) => {
                console.log('Received message:', message);
                socketServices.emit('seenMessages', { userId: authUser._id, senderId: userId });
                if (message.sender === authUser?._id || message.receiver === authUser?._id) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });
            return () => {
                socketServices.removeListener('receiveMessage');
                socketServices.removeListener('seenMessages');
            };
        }
    }, [userId]);


    const handleSendMessage = async () => {
        if (inputText.trim()) {
            const newMessage = { sender: authUser._id, receiver: userId, message: inputText };

            socketServices.emit('sendMessage', newMessage);
            setInputText('');
        }
    };

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error:', response.errorMessage);
            } else if (response.assets) {
                const newMessage: Message = {
                    _id: Date.now().toString(),
                    sender: authUser._id,
                    receiver: userId,
                    imageUri: response.assets[0].uri,
                    createdAt: formatTime(new Date()),
                };
                socketServices.emit('sendMessage', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[styles.messageContainer, item.sender === authUser._id ? styles.userMessage : styles.receivedMessage]}>
            {item.message ? <Text style={styles.messageText}>{item.message}</Text> : null}
            {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.messageImage} /> : null}
            <Text style={styles.timestamp}>{moment(item?.createdAt).format('LLL')}</Text>
        </View>
    );

    const handleCallPress = () => {
        const phoneNumber = '1234567890';
        Linking.openURL(`tel:${phoneNumber}`).catch((err) => console.error('Error opening dialer:', err));
    };

    return (
        <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
            <CustomHeader type="back" screenName="Chat" onPressBack={() => props.navigation.goBack()} />

            <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item._id} contentContainerStyle={styles.chatContainer} />

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Type a message..." value={inputText} onChangeText={setInputText} />

                <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
                    <Image source={Images.call} style={styles.callIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.ImgButton} onPress={handleImagePick}>
                    <Image source={Images.gallery} style={styles.callIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Image source={Images.message} style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    chatContainer: { padding: 10 },
    messageContainer: { marginVertical: 5, padding: 10, borderRadius: 10, maxWidth: '80%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: AllColors.primary300 },
    receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#e5e5ea' },
    messageText: { color: '#000' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
    input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10 },
    callButton: { backgroundColor: AllColors.primary300, borderRadius: 30, padding: 10, justifyContent: 'center', alignItems: 'center', width: 40, height: 40, marginLeft: 5 },
    sendButton: { backgroundColor: AllColors.primary300, borderRadius: 30, padding: 10, justifyContent: 'center', alignItems: 'center', width: 40, height: 40, marginLeft: 5 },
    messageImage: { width: 150, height: 150, borderRadius: 10, marginVertical: 5 },
    timestamp: { fontSize: 12, color: AllColors.black, alignSelf: 'flex-end', fontFamily: Fonts.AfacadBold, top: 5 },
    callIcon: {
        height: 25,
        width: 25,
        tintColor: AllColors.white,
    },
    ImgButton: {
        backgroundColor: AllColors.primary300,
        borderRadius: 30,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginLeft: 5,
    },
    sendIcon: {
        height: 25,
        width: 25,
        tintColor: AllColors.white,
    },
});

export default ChatScreenWithCategory;
