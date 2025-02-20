/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { ToastProvider } from 'react-native-toast-notifications';
import Route from "./src/Navigation/Route";
import { AuthContextProvider } from "./src/context/AuthContext";
import { SocketContextProvider } from "./src/context/SocketContext";
function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <AuthContextProvider>
        <SocketContextProvider>
        <Route />
        </SocketContextProvider>
      </AuthContextProvider>
    </ToastProvider>
  );
}

export default App;

