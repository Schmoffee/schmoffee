import {Analytics} from 'aws-amplify';
import notifee, {AndroidImportance, AndroidVisibility, AuthorizationStatus, Notification} from '@notifee/react-native';
import {getNotificationsAsked} from './storage';

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

async function sendLocalNotification(notification: Notification) {
  const notificationId = await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    android: {
      channelId: '1',
      pressAction: {
        id: 'default',
      },
      visibility: AndroidVisibility.PUBLIC,
      sound: 'coffee_time.mp3',
    },
  });
  console.log('Notification sent: ', notificationId);
}

async function checkPermissions() {
  const settings = await notifee.getNotificationSettings();
  if (settings) {
    if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
      const asked = await getNotificationsAsked();
      console.log('Asked for permission: ', asked);
      if (asked) {
        return false;
      } else {
        const res = await notifee.requestPermission();
        return res.authorizationStatus === AuthorizationStatus.AUTHORIZED;
      }
    }
    return true;
  }
  return false;
}

async function checkChannel() {
  const schannel = await notifee.getChannel('1');
  if (schannel === null) {
    const res = await notifee.createChannel({
      id: '1',
      name: 'Schmoffee',
      importance: AndroidImportance.HIGH,
      sound: 'coffee_time',
      visibility: AndroidVisibility.PUBLIC,
      description: 'A channel to categorise your Schmoffee Notifications',
    });
    console.log('Channel created: ', res);
  }
}

export {updateEndpoint, checkChannel, sendLocalNotification, checkPermissions};
