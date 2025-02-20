import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};  

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('chat-user');
        if (user) {
          setAuthUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
      }
    };
    loadUser();
  }, []);
  useEffect(() => {
    const saveUser = async () => {
      if (authUser) {
        try {
          await AsyncStorage.setItem('chat-user', JSON.stringify(authUser));
        } catch (error) {
          console.error("Failed to save user to AsyncStorage", error);
        }
      } else {
        await AsyncStorage.removeItem('chat-user');
      }
    };

    saveUser();
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
