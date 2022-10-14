import {Analytics} from 'aws-amplify';
import {Platform} from 'react-native';

async function updateEndpoint(token: string, userId: string) {
  await Analytics.updateEndpoint({
    address: token, // The unique identifier for the recipient. For example, an address could be a device token, email address, or mobile phone number.
    attributes: {
      // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
    },
    channelType: Platform.OS === 'ios' ? 'APNS' : 'GCM',
    // Customized userId
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

async function getEndPoint(userId: string) {
  // @ts-ignore
  const endpointId = Analytics.getPluggable('AWSPinpoint')._config.endpointId;
  console.log(endpointId);
  const response = await fetch(
    `https://pinpoint.eu-central-1.amazonaws.com/v1/apps/3648ce85f9d543e1877c149dccf556b4/users/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).catch(error => {
    if (error.toString() === 'TypeError: Network request failed') {
      console.log('Network request failed');
    } else {
      console.log(error);
    }
  });
  if (response) {
    const data = await response.json();
    console.log(data);
    return data;
  }
}

async function sendNotificationToUser(userId: string, token: string, service: string): Promise<void> {
  const body = {
    userID: userId,
    token: token,
    service: service,
  };
  console.log('token', token);
  const response = await fetch('https://2fvbhkzlyzigebvyncbt4mwod40ehpat.lambda-url.eu-central-1.on.aws/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch(error => {
    if (error.toString() === 'TypeError: Network request failed') {
      console.log('Network request failed');
    } else {
      console.log(error);
    }
  });
  console.log(response);
  if (response) {
    const data = await response.json();
    console.log(data);
  }
}

export {updateEndpoint, getEndPoint, sendNotificationToUser};
