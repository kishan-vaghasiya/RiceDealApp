import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();
    const [notification, setNotification] = useState(true);

    useEffect(() => {
        const serverURI = 'https://ricedeal.onrender.com'; 
    
        if (authUser) {
            const socket = io(serverURI, {
                query: { userId: authUser?._id },
                transports: ['websocket'],
            });
    
            socket.on('connect', () => {
                console.log('Socket connected');
                setSocket(socket);
                setIsSocketReady(true);
            });
    
            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsSocketReady(false);
            });
    
            socket.on('getOnlineUser', (users) => {
                setOnlineUsers(users);
            });
    
            return () => {
                socket.close();
                setSocket(null);
                setIsSocketReady(false);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
                setIsSocketReady(false);
            }
        }
    }, [authUser]);
    

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, notification, setNotification }}>
            {children}
        </SocketContext.Provider>
    );
};
