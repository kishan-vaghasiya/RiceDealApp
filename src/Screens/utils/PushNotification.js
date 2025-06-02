/* 
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
// import PushNotification from 'react-native-push-notification';
// import { navigationRef } from '../common/component/NavigationService';


export async function requestUserPermission() {
  if(Platform.OS == 'android' && Platform.Version >= 33){
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if(granted == PermissionsAndroid.RESULTS.GRANTED){
              getFCMToken()
      }else{
        console.log('Permission Denied');
      }

    }else{
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        // await messaging().registerDeviceForRemoteMessages();
      if (enabled) {
        console.log('Authorization status:', authStatus);
        // await messaging().registerDeviceForRemoteMessages();
        getFCMToken()
      }
    }
}
const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken')
  console.log(fcmToken,"Fcm old token")
  if(!fcmToken){
     try {
       await messaging().registerDeviceForRemoteMessages();
         const fcmToken = await messaging().getToken();
         if(fcmToken){
             console.log(fcmToken,"new generate fcm token")
             await AsyncStorage.setItem('fcmToken',fcmToken)
         }
     } catch (error) {
         
         console.log(error,'error rasied in fcm token ')
     }
  }
};

messaging().onMessage(async remoteMessage => {
  console.log('Foreground remoteMessage:', remoteMessage);
  if (Platform.OS === 'ios') {
    PushNotification.localNotification({
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
    });
  }
  updateNotificationCount();
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background remoteMessage:', remoteMessage);
  updateNotificationCount();
});

messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('Initial remoteMessage:', remoteMessage);
      // Ensure the navigationRef is properly defined and used
      navigationRef.current?.navigate('Notification');
    }
  }) */
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';

// Request permissions
export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getFcmToken();
    } else {
      console.log('Notification permission denied');
    }
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    }
  }
}

// Get FCM token
const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        console.log('New FCM token:', token);
        await AsyncStorage.setItem('fcmToken', token);
      }
    } catch (error) {
      console.error('FCM token error:', error);
    }
  } else {
    console.log('Old FCM token:', fcmToken);
  }
};

// Create channel once on app load (Android only)
export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

// Foreground messages
messaging().onMessage(async remoteMessage => {
  console.log('Foreground Message:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher', // Ensure this icon exists
      pressAction: {
        id: 'default',
      },
    },
  });

  updateNotificationCount();
});

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message:', remoteMessage);
  updateNotificationCount();
});

// Initial notification (when app is opened from quit state)
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('Initial notification:', remoteMessage);
      navigationRef.current?.navigate('Notification');
    }
  });
