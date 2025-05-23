
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

// messaging().getInitialNotification().then(remoteMessage => {
//   if (remoteMessage) {
//     console.log('Initial remoteMessage:', remoteMessage);
//     navigationRef('Notification'); 
//   }
// });
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('Initial remoteMessage:', remoteMessage);
      // Ensure the navigationRef is properly defined and used
      navigationRef.current?.navigate('Notification');
    }
  })