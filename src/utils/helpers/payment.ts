/**
 * Fetch the payments' sheet parameters from the server.
 * @return  Return the encapsulated details about the transaction.
 * @param total The total amount to pay
 */
import {SetupParams} from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet';
import {
  confirmApplePayPayment,
  confirmPaymentSheetPayment,
  createGooglePayPaymentMethod,
  initGooglePay,
  InitPaymentSheetResult,
  presentApplePay,
  PresentPaymentSheetResult,
} from '@stripe/stripe-react-native';
import {Payment, PaymentParams} from '../types/data.types';
import {updateCustomerId} from '../queries/datastore';
import {Alert} from 'react-native';
import {getClientSecret, setClientSecret} from './storage';

async function createPaymentIntent(paymentParams: PaymentParams, paymentMethod?: string) {
  let body;
  if (paymentParams.customer_id) {
    body = {
      amount: paymentParams.amount,
      customerID: paymentParams.customer_id,
      currency: paymentParams.currency,
      payment_method: paymentMethod,
    };
  } else {
    body = {
      amount: paymentParams.amount,
      name: paymentParams.name,
      phone: paymentParams.phone,
      currency: paymentParams.currency,
      payment_method: paymentMethod,
    };
  }

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
    const {client_secret, ephemeralKey, customer, paymentIntentId} = data;
    return {
      client_secret,
      ephemeralKey,
      customer,
      paymentIntentId,
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
): Promise<string | null> {
  const response = await createPaymentIntent(paymentParams);
  if (response) {
    await updateCustomerId(response.customer, userID);
    const {error} = await initPaymentSheet({
      customerId: response.customer,
      customerEphemeralKeySecret: response.ephemeralKey,
      paymentIntentClientSecret: response.client_secret,
      merchantDisplayName: 'Schmoffee',
      customFlow: true,
      defaultBillingDetails: {
        address: {
          country: 'UK',
        },
      },
    });
    if (error) {
      console.log(error);
      return null;
    } else {
      return response.paymentIntentId;
    }
  } else {
    return null;
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
    console.log(error);
    return false;
  } else {
    return true;
  }
}

async function cancelPayment(payment_id: string) {
  const body = {
    payment_id: payment_id,
  };
  const response = await fetch('https://ww6tttf7xjqe5koqhf32x5qzru0xonvy.lambda-url.eu-central-1.on.aws/', {
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
  }
}

async function confirmGooglePayPayment(payment_id: string) {
  const body = {
    payment_id: payment_id,
  };
  const response = await fetch('https://cisd7652yszt7dme7yl2wlblny0wlrxz.lambda-url.eu-central-1.on.aws/', {
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
  }
}

const createGooglePaymentMethod = async (userID: string, paymentParams: PaymentParams) => {
  const {error, paymentMethod} = await createGooglePayPaymentMethod({
    amount: paymentParams.amount,
    currencyCode: 'GBP',
  });

  if (error) {
    Alert.alert(error.code, error.message);
    return;
  } else if (paymentMethod) {
    const paymentResponse = await createPaymentIntent(paymentParams, paymentMethod.id);
    if (paymentResponse) {
      await updateCustomerId(paymentResponse.customer, userID);
      return paymentResponse.paymentIntentId;
    } else {
      return null;
    }
  }
};

async function initializeGooglePay() {
  const {error} = await initGooglePay({
    testEnv: true,
    merchantName: 'Schmoffee',
    countryCode: 'UK',
    billingAddressConfig: {
      format: 'FULL',
      isPhoneNumberRequired: true,
      isRequired: false,
    },
    existingPaymentMethodRequired: false,
    isEmailRequired: true,
  });

  if (error) {
    Alert.alert(error.code, error.message);
    return;
  }
}

async function payWithApplePay(userID: string, paymentParams: PaymentParams) {
  const {error} = await presentApplePay({
    cartItems: [{label: 'Your Order', amount: paymentParams.amount.toString(), paymentType: 'Immediate'}],
    country: 'UK',
    currency: 'GBP',
    requiredBillingContactFields: ['phoneNumber', 'name'],
  });
  console.log(error);
  if (error) {
    Alert.alert('Apple Pay payment sheet error occurred.');
  } else {
    const paymentResponse = await createPaymentIntent(paymentParams);
    if (paymentResponse) {
      await setClientSecret(paymentResponse.client_secret);
      await updateCustomerId(paymentResponse.customer, userID);
      return paymentResponse.paymentIntentId;
    } else {
      return null;
    }
  }
}

async function confirmPayment(mode: Payment, payment_id: string) {
  if (mode === 'card') {
    const {error} = await confirmPaymentSheetPayment();
    if (error) {
      Alert.alert(`Error confirming card payment: ${error.code}`, error.message);
    }
  } else if (mode === 'google') {
    await confirmGooglePayPayment(payment_id);
  } else if (mode === 'apple') {
    const secret = await getClientSecret();
    if (secret != null) {
      await confirmApplePayPayment(secret);
    } else {
      Alert.alert('Error', 'Unable to confirm apple pay payment');
    }
  }
}

export {
  initializePaymentSheet,
  openPaymentSheet,
  cancelPayment,
  initializeGooglePay,
  createGooglePaymentMethod,
  confirmGooglePayPayment,
  payWithApplePay,
  confirmPayment,
};
