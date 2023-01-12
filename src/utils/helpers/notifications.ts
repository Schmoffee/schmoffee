import {Analytics} from 'aws-amplify';
import {Platform} from 'react-native';
// @ts-ignore
import PushNotification from 'react-native-push-notification';
import {AndroidNotifSpec, GenericNotifSpec, iosNotifSpec} from '../types/data.types';

async function updateEndpoint(token: string): Promise<void> {
  console.log('Updating endpoint with token: ', token);
  await Analytics.updateEndpoint({
    address: token,
    attributes: {
      // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
    },
    channelType: 'GCM',
    userId: token,
    optOut: 'NONE',
  })
    .then(data => {
      console.log('Endpoint updated: ', data);
    })
    .catch(error => {
      console.log('error updating endpoint', error);
    });
}

const SendLocalNotification = (genericSpec: GenericNotifSpec, deviceSpec: AndroidNotifSpec | iosNotifSpec) => {
  if (Platform.OS === 'ios') {
    PushNotification.localNotification({
      ...genericSpec,
      ...deviceSpec,
    });
  } else {
    PushNotification.localNotification({
      ...genericSpec,
      ...deviceSpec,
    });
  }
};

export {updateEndpoint, SendLocalNotification};
