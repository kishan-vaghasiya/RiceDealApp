import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';

import useSendMessage from '../hooks/useSendMessage';
import { Images } from '../Assets/Images';

function MessageInput() {
  const [message, setMessage] = useState('');
  const {loading, sendMessage} = useSendMessage();

  const handleSubmit = async () => {
    if (!message) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Send a message"
          placeholderTextColor="#A9A9A9"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Image source={Images.sendMessage} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
    
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D2D', // equivalent to bg-gray-700
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    padding: 8,
    borderRadius: 8,
  },
  button: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -12}],
    padding: 5,
  },
});

export default MessageInput;
