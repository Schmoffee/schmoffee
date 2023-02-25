const aws = require('aws-sdk');

const {Parameters} = await new aws.SSM()
  .getParameters({
    Names: ['stripeKey'].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

// Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]

const stripe = require('stripe')(Parameters.find(({Name}) => Name === 'stripeKey').Value);
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  const body = JSON.parse(event.body);
  const paymentId = body.payment_id;
  let retval;
  let stat_code;
  try {
    retval = await stripe.paymentIntents.confirm(paymentId, {return_url: 'https://schmoffee.com'});
    stat_code = 200;
  } catch (err) {
    retval = err;
    stat_code = 500;
  }
  return {
    statusCode: stat_code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(retval),
  };
};
