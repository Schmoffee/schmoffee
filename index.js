/**
 * @format
 */
import '@azure/core-asynciterator-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill';
import {AppRegistry, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {DataStore} from 'aws-amplify';
import awsConfig from './src/aws-exports';
import {Amplify} from 'aws-amplify';
import RemotePushNotification from '@aws-amplify/pushnotification';
import LocalPushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {SendLocalNotification} from './src/utils/helpers/notifications';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

RemotePushNotification.onNotification(async notification => {
  // Note that the notification object structure is different from Android and IOS
  console.log('Remote notification received', notification);
  const genericSpec = {title: notification.title, message: notification.body};
  if (Platform.OS === 'ios') {
    const specs = {};
    SendLocalNotification(genericSpec, specs);
  } else {
    LocalPushNotification.getChannels(function (channel_ids) {
      if (channel_ids.length > 0) {
        const specs = {};
        specs.channelId = channel_ids[0];
        SendLocalNotification(genericSpec, specs);
      } else {
        console.log('no channel_ids');
      }
    });
  }

  // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/push-notification-ios#finish)
  if (Platform.OS === 'ios') {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }
});

// get the notification data when notification is opened
RemotePushNotification.onNotificationOpened(notification => {
  console.log('the remote notification is opened', notification);
});

LocalPushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // Do nothing. This is already handled by the RemotePushNotification.onNotification handler
  },
  senderID: '954779945360',
  requestPermissions: Platform.OS !== 'ios',
});

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

AppRegistry.registerComponent(appName, () => App);
