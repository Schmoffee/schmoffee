/**
 * Fetch the payments' sheet parameters from the server.
 * @return  Return the encapsulated details about the transaction.
 * @param total The total amount to pay
 */
import {SetupParams} from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet';
import {
  confirmPaymentSheetPayment,
  InitPaymentSheetResult,
  PresentPaymentSheetResult,
} from '@stripe/stripe-react-native';
import {PaymentParams} from '../types/data.types';
import {updateCustomerId} from '../queries/datastore';

async function fetchPaymentSheetParams(paymentParams: PaymentParams) {
  let body;
  if (paymentParams.customer_id) {
    body = {amount: paymentParams.amount, customerID: paymentParams.customer_id, currency: paymentParams.currency};
  } else {
    body = {
      amount: 50,
      name: paymentParams.name,
      phone: paymentParams.phone,
      currency: paymentParams.currency,
    };
  }
  console.log(body);

  const response = await fetch('https://myxpomnspkvsnn4i2kb6uuonta0cjdap.lambda-url.eu-central-1.on.aws/', {
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
  if (response) {
    const data = await response.json();
    console.log(data);
    const {paymentIntent, ephemeralKey, customer} = data;
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  }
}

/**
 * Initialize the stripe payment sheet.
 * @param initPaymentSheet The method for initiating the payment sheet.
 * @param paymentParams
 * @param userID
 */
async function initializePaymentSheet(
  initPaymentSheet: (params: SetupParams) => Promise<InitPaymentSheetResult>,
  paymentParams: PaymentParams,
  userID: string,
) {
  const response = await fetchPaymentSheetParams(paymentParams);
  if (response) {
    await updateCustomerId(response.customer, userID);
    const {error} = await initPaymentSheet({
      customerId: response.customer,
      customerEphemeralKeySecret: response.ephemeralKey,
      paymentIntentClientSecret: response.paymentIntent,
      merchantDisplayName: 'Schmoffee',
      customFlow: true,
      defaultBillingDetails: {
        address: {
          country: 'UK',
        },
      },
      googlePay: {
        merchantCountryCode: 'UK',
        testEnv: true, // use test environment
      },
    });
    if (error) {
      console.log(error);
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 * Open the payment sheet if no error occurs
 * @param presentPaymentSheet Function for opening the payment sheet.
 * @return boolean Return true if the payment sheet can be open, false otherwise.
 */
async function openPaymentSheet(presentPaymentSheet: () => Promise<PresentPaymentSheetResult>) {
  const {error, paymentOption} = await presentPaymentSheet();
  if (error) {
    if (error.code === 'Canceled') {
      return false;
    }
    console.log(error);
    return false;
  } else {
    console.log(paymentOption);
    return true;
  }
}

export {initializePaymentSheet, openPaymentSheet};
