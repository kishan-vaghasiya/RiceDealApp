/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { ToastProvider } from 'react-native-toast-notifications';
import Route from "./src/Navigation/Route";
import { AuthContextProvider } from "./src/context/AuthContext";
import { createNotificationChannel, requestUserPermission } from "./src/Screens/utils/PushNotification";
function App(): React.JSX.Element {

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel();
  }, [])

  return (
    <ToastProvider>
      <AuthContextProvider>
        <Route />
      </AuthContextProvider>
    </ToastProvider>
  );
}

export default App;

