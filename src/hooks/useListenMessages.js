import React, { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext'; 
import { useAuthContext } from '../context/AuthContext';

function useListenMessages() {
    const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);

  return messages;

}

export default useListenMessages;
