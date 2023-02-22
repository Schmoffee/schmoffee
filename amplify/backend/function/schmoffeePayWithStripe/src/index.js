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
  let customer;
  if (body.hasOwnProperty('customerID')) {
    customer = await stripe.customers.retrieve(body.customerID);
  } else {
    customer = await stripe.customers.create({
      name: body.name,
      phone: body.phone,
    });
  }

  let paymentIntentParams;

  if (body.payment_method) {
    paymentIntentParams = {
      amount: body.amount,
      currency: body.currency,
      customer: customer.id,
      setup_future_usage: 'off_session',
      payment_method: body.payment_method,
      automatic_payment_methods: {
        enabled: true,
      },
    };
  } else {
    paymentIntentParams = {
      amount: body.amount,
      currency: body.currency,
      customer: customer.id,
      setup_future_usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
      },
    };
  }

  const ephemeralKey = await stripe.ephemeralKeys.create({customer: customer.id}, {apiVersion: '2022-08-01'});
  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
  const response = {
    client_secret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      'pk_test_51LpXnPHooJo3N51b7Z3VtEqrSdqqibloS52hthuoujRyJMo7cRUnVVXY8HUApFgsmk9MctXNbcLFLftl9qv9QpVL00ynhr4KLf',
    paymentIntentId: paymentIntent.id,
  };
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(response),
  };
};
