/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import {DataStore} from 'aws-amplify';
import { CurrentOrder, OrderInfo, OrderItem, Status } from "../../../../../src/models/index.js";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  var foo = event.foo;
  var bar = event.bar;
  var result = SendOrder(foo, bar);
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify(result),
  };
};

async function SendOrder() {
  await DataStore.save(
    new CurrentOrder({
      items: [new OrderItem({name: 'Latte', price: 10})],
      user: '{"Meyad": 20}',
      shop: '{"Hermanos": 20}',
      sent_time: '2022-01-29T07:45:19.915Z',
      initial_scheduled_time: '2022-01-29T07:45:19.915Z',
      total: 10.4,
      order_info: new OrderInfo({status: Status.RECEIVED}),
    }),
  );
  console.log('Current order saved');
}
