const stripe = require('stripe')(
  'sk_test_51LpXnPHooJo3N51bI8csPCrV7HNR3bHYSaO1tOhO60allyrVeEFmoXqf5sVhtEEhu40IzSwsXtT2OKoQsDJh6Az900zfxgBpvs',
);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  const payment_intent_id = event.body.payment_id;
  let retval;
  let stat_code;
  try {
    retval = await stripe.paymentIntents.cancel(payment_intent_id);
    stat_code = 200;
  } catch (error) {
    stat_code = 400;
    retval = error;
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
