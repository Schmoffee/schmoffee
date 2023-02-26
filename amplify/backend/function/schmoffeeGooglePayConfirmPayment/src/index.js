const stripe = require('stripe')(
  'sk_test_51LpXnPHooJo3N51bI8csPCrV7HNR3bHYSaO1tOhO60allyrVeEFmoXqf5sVhtEEhu40IzSwsXtT2OKoQsDJh6Az900zfxgBpvs',
);
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
