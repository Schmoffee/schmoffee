/**
 * @format
 */
import 'react-native-get-random-values';
import 'react-native-url-polyfill';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {DataStore} from 'aws-amplify';
import awsConfig from './src/aws-exports';
import {Amplify} from 'aws-amplify';
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
