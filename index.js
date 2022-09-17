/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Amplify, DataStore} from 'aws-amplify';

DataStore.configure({
  authProviders: undefined,
  maxRecordsToSync: 10000,
  syncPageSize: 1000,
});

AppRegistry.registerComponent(appName, () => App);
