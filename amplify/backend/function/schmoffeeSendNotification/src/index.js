/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  const body = JSON.parse(event.body);
  const region = 'eu-central-1';
  const title = body.title;
  const message = body.message;
  const applicationId = '3648ce85f9d543e1877c149dccf556b4';
  const recipient = {
    token: body.token,
    service: body.service,
  };
  const action = 'OPEN_APP';
  const priority = 'high';
  const silent = false;

  function CreateMessageRequest() {
    let messageRequest;
    const token = recipient.token;
    const service = recipient.service;
    if (service === 'GCM') {
      messageRequest = {
        Addresses: {
          [token]: {
            ChannelType: 'GCM',
          },
        },
        MessageConfiguration: {
          GCMMessage: {
            Action: action,
            Body: message,
            Priority: priority,
            SilentPush: silent,
            Title: title,
            IconReference: 'ic_launcher.png',
            SmallImageIconUrl: 'https://www.schmoffee.co.uk/img/small_icon.png',
            ImageIconUrl: 'https://www.schmoffee.co.uk/img/icon.png',
          },
        },
      };
    } else if (service === 'APNS') {
      messageRequest = {
        Addresses: {
          [token]: {
            ChannelType: 'APNS',
          },
        },
        MessageConfiguration: {
          APNSMessage: {
            Action: action,
            Body: message,
            Priority: priority,
            SilentPush: silent,
            Title: title,
          },
        },
      };
    }
    return messageRequest;
  }

  const messageRequest = CreateMessageRequest();
  AWS.config.update({region: region});
  const pinpoint = new AWS.Pinpoint();
  const params = {
    ApplicationId: applicationId,
    MessageRequest: messageRequest,
  };

  let status;
  let code;
  try {
    let data = await pinpoint.sendMessages(params).promise();
    const readable_data = JSON.stringify(data, null, 2);
    if (data.MessageResponse.Result[recipient.token].DeliveryStatus === 'SUCCESSFUL') {
      status = 'Message sent! Response information: ' + readable_data;
      code = 200;
    } else {
      status = "The message wasn't sent. Response information: " + readable_data;
      code = 400;
    }
  } catch (error) {
    console.log('ERROR sending email: ' + error);
    status = 'Error sending message: ' + error;
    code = 400;
  }

  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(status),
  };
};
