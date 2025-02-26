import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View, Linking, StyleSheet, } from 'react-native';
import { useAuthContext } from '../../../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Fonts } from '../../../Constants/Fonts';
import { Images } from '../../../Assets/Images';
import axios from 'axios';

export default function DealChat({ route }) {
  const { userData } = route.params;

  console.log(`https://ricedeal.onrender.com/api/v1/messages/${userData?._id}`);

  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && lastMessageRef.current) {
      lastMessageRef.current.scrollToIndex({
        index: messages.length - 1,
        animated: true,
      });
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      setIsSocketReady(true);
    } else {
      setIsSocketReady(false);
    }
  }, [socket]);

  const sendMessage = async () => {
    if (!inputText.trim()) {
      console.log('Message is empty');
      return;
    }

    if (isSocketReady && socket) {
      const newMessage = {
        message: inputText,
        senderId: authUser?._id,
        createdAt: new Date().toLocaleTimeString(),
      };

      console.log('Sending message:', newMessage);
      socket.emit('sendMessage', newMessage);

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
    } else {
      try {
        const response = await axios.post(`https://ricedeal.onrender.com/api/v1/messages/${userData?._id}`, { message: inputText }, { headers: { Authorization: `Bearer ${authUser?.token}` } },);
        console.log('respose', response);
        console.log('Message sent via API:', response.data);
        const newMessage = {
          message: inputText,
          senderId: authUser?._id,
          createdAt: new Date().toLocaleTimeString(),
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message via API:', error);
      }
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        const newMessage = {
          imageUri: response.assets[0].uri,
          senderId: authUser?._id,
          createdAt: new Date().toLocaleTimeString(),
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });
  };

  const handleCallPress = () => {
    const phoneNumber = userData?.number || '1234567890';
    Linking.openURL(`tel:${phoneNumber}`).catch(err =>
      console.error('Error opening dialer:', err),
    );
  };

  const renderMessage = ({ item }) => {
    const fromMe = item.senderId === authUser?._id;
    return (
      <View
        style={[
          styles.messageContainer,
          fromMe ? styles.userMessage : styles.receivedMessage,
        ]}>
        {item.message ? (
          <Text style={styles.messageText}>{item.message}</Text>
        ) : item.imageUri ? (
          <TouchableOpacity onPress={() => setSelectedImageUri(item.imageUri)}>
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.timestamp}>{item.createdAt}</Text>
      </View>
    );
  };

  return (
    <Container backgroundColor={AllColors.white}>
      <View style={styles.headerContainer}>
        <Text style={styles.itemName}>{userData?.name}</Text>
        <Image source={{ uri: userData?.image }} style={styles.itemImage} />
        <Text style={styles.adminName}>{userData?.city}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        ref={lastMessageRef}
        onContentSizeChange={(contentWidth, contentHeight) => {
          if (contentHeight > 0) {
            lastMessageRef.current?.scrollToIndex({
              index: messages.length - 1,
              animated: true,
            });
          }
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
          <Image source={Images.call} style={styles.callIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ImgButton} onPress={handleImagePick}>
          <Image source={Images.gallery} style={styles.callIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image source={Images.message} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}>
          <Image source={{ uri: selectedImageUri }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  itemName: {
    textAlign: 'center',
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    fontSize: 18,
  },
  itemImage: {
    width: 70,
    height: 70,
    marginVertical: 5,
    borderRadius: 35,
  },
  adminName: {
    textAlign: 'center',
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    fontSize: 16,
  },
  chatContainer: {
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: AllColors.primary300,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  messageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: AllColors.black,
    alignSelf: 'flex-end',
    fontFamily: Fonts.AfacadBold,
    top: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  callButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
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
  sendButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  callIcon: {
    height: 25,
    width: 25,
    tintColor: AllColors.white,
  },
  sendIcon: {
    height: 25,
    width: 25,
    tintColor: AllColors.white,
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
