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

  const users = {
    [body.userID]: {},
  };
  const region = 'eu-central-1';
  const title = 'Status Update';
  const message = 'Yooo';
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
          Users: users,
        },
      };
    }

    return messageRequest;
  }

  function getResponse(isSuccess, data) {
    let status;
    let code;
    if (isSuccess) {
      if (data.MessageResponse.Result[recipient.token].DeliveryStatus === 'SUCCESSFUL') {
        status = 'Message sent! Response information: ';
        code = 200;
      } else {
        status = "The message wasn't sent. Response information: ";
        code = 400;
      }
    } else {
      status = data;
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
  }

  function SendMessage() {
    const messageRequest = CreateMessageRequest();
    // Specify that you're using a shared credentials file, and specify the
    // IAM profile to use.
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
    AWS.config.update({region: region});

    const pinpoint = new AWS.Pinpoint();
    const params = {
      ApplicationId: applicationId,
      MessageRequest: messageRequest,
    };

    // Try to send the message.
    pinpoint.sendMessages(params, function (err, data) {
      return getResponse(false, err ? err : data);
    });
  }

  return SendMessage();
};
