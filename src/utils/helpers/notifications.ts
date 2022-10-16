import {Analytics} from 'aws-amplify';
import {Platform} from 'react-native';
// @ts-ignore
import PushNotification from 'react-native-push-notification';
import {AndroidNotifSpec, GenericNotifSpec, iosNotifSpec} from '../types/data.types';

async function updateEndpoint(token: string, userId: string): Promise<void> {
  await Analytics.updateEndpoint({
    address: token, // The unique identifier for the recipient. For example, an address could be a device token, email address, or mobile phone number.
    attributes: {
      // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
    },
    channelType: Platform.OS === 'ios' ? 'APNS' : 'GCM',
    userId: userId,
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
