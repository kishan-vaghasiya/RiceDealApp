import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { AllColors } from '../../../Constants/COLORS';
import { NavigationProp } from '@react-navigation/native';
import { Container } from '../../../Components/Container/Container';
import { Images } from '../../../Assets/Images';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { Fonts } from '../../../Constants/Fonts';

interface ChatScreenProps {
  navigation: NavigationProp<any, any>;
}

interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'received';
  imageUri?: string;
  timestamp: string;
}

const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          imageUri: (response.assets as Asset[])[0].uri,
          timestamp: formatTime(new Date()),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: formatTime(new Date()),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.receivedMessage,
      ]}
    >
      {item.text ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
      ) : null}
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const phoneNumber = '1234567890';
  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
        console.error('Error opening dialer:', err)
      );
    } else {
      console.log('Phone number not available');
    }
  };

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Chat"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
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
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    padding: 10,
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
  },
  callButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 5,
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
  timestamp: {
    fontSize: 12,
    color:AllColors.black,
    alignSelf: 'flex-end',
    fontFamily:Fonts.AfacadBold,
    top:5
  },
});

export default ChatScreen;
