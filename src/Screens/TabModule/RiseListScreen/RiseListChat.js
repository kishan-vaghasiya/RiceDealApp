import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {Fonts} from '../../../Constants/Fonts';
import {Images} from '../../../Assets/Images';
import {launchImageLibrary} from 'react-native-image-picker';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';

export default function RiseListChat({route}) {
  const {itemData} = route.params;
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello, how can I help you?',
      sender: 'other',
      timestamp: '10:05 AM',
    },
    {
      id: '2',
      text: 'I am looking for a product.',
      sender: 'user',
      timestamp: '10:06 AM',
    },
    {
      id: '3',
      text: 'Sure, we have several options available.',
      sender: 'other',
      timestamp: '10:07 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const phoneNumber = itemData.mobile || '1234567890';

  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(err =>
        console.error('Error opening dialer:', err),
      );
    } else {
      console.log('Phone number not available');
    }
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const newMessage = {
          id: Date.now().toString(),
          text: '',
          sender: 'user',
          imageUri: response.assets[0].uri,
          timestamp: formatTime(new Date()),
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: formatTime(new Date()),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.receivedMessage,
      ]}>
      {item.text ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : item.imageUri ? (
        <TouchableOpacity onPress={() => handleImagePress(item.imageUri)}>
          <Image source={{uri: item.imageUri}} style={styles.messageImage} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const handleImagePress = imageUri => {
    setSelectedImageUri(imageUri);
    setModalVisible(true);
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <View style={styles.headerContainer}>
        <Text style={styles.itemName}>{itemData.name}</Text>
        <Image source={{uri: itemData.image}} style={styles.itemImage} />
        <Text style={styles.adminName}>{itemData.city}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContainer}
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
          <Image source={{uri: selectedImageUri}} style={styles.modalImage} />
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
