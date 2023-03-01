/**
 * @format
 */
import '@azure/core-asynciterator-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {DataStore} from 'aws-amplify';
import awsConfig from './src/aws-exports';
import {Amplify} from 'aws-amplify';
import {LogBox} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {checkChannel, sendLocalNotification} from './src/utils/helpers/notifications';
import {getCurrentAuthUser} from './src/utils/queries/auth';
LogBox.ignoreLogs(['new NativeEventEmitter']);

async function onMessageReceived(message) {
  console.log('onMessageReceived', message);
  const data = message.data;
  const title = data['pinpoint.notification.title'];
  const body = data['pinpoint.notification.body'];
  const user = await getCurrentAuthUser();
  if (user) {
    const NotifeeNotif = {title: title, body: body};
    await checkChannel();
    await sendLocalNotification(NotifeeNotif);
  }
  // notification.finish(PushNotificationIOS.FetchResult.NoData);
}

Amplify.configure({
  ...awsConfig,
  PushNotification: {
    requestIOSPermissions: false,
  },
});

DataStore.configure({
  authProviders: undefined,
  maxRecordsToSync: 10000,
  syncPageSize: 1000,
});

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
AppRegistry.registerComponent(appName, () => App);
