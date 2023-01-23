import {Alert} from 'react-native';
import {registerError} from '../queries/datastore';
export const AlertMessage = {
  OFFLINE: {
    title: 'You are offline.',
    message: 'It looks like you are not connected to the internet, certain features might not be working.',
  },
  DATABASE: {
    title: 'An error occurred',
    message: 'We are sorry for the inconvenience, we will make sure this does not happen again. code 1.',
  },
  TOKEN: {
    title: 'An error occurred',
    message: 'We are sorry for the inconvenience, we will make sure this does not happen again. code 2.',
  },
  WRONG_OTP: {
    title: 'Wrong OTP',
    message: 'You can try as many times as you want. The code will be valid for 3 minutes.',
  },
  EXPIRED_OTP: {
    title: 'OTP Expired',
    message: 'This code has expired. Please request a new one.',
  },
  BAD_PHONE_NUMBER: {
    title: 'Bad Phone Number',
    message: "That doesn't look like a valid phone number.",
  },
  ELSE: {
    title: 'Rare Error!',
    message: "This is a funky error! We don't really know what went wrong, but something went wrong.",
  },
  LOCATION: {
    title: 'Location inaccessible',
    message: 'An error occured when accessing your current location, want to try that again ?',
  },
  STORAGE: {
    title: 'An error occurred',
    message: 'We are sorry for the inconvenience, we will make sure this does not happen again. code 3.',
  },
  PAYMENT: {
    title: 'Payment error',
    message: 'An error occurred when connecting to the payment server...',
  },
  LOGOUT: {
    title: 'Logout',
    message: 'You are about to logout, you will lose your current basket, are you sure?',
  },
  OUT_OF_STOCK: {
    title: 'Out of stock',
    message:
      'Apologies, we had to remove the following items and/or options from your basket because they suddenly went out of stock: ',
  },
};

export const Alerts = {
  offlineAlert: () => {
    Alert.alert(AlertMessage.OFFLINE.title, AlertMessage.OFFLINE.message);
  },
  databaseAlert: () => {
    Alert.alert(AlertMessage.DATABASE.title, AlertMessage.DATABASE.message);
  },
  tokenAlert: () => {
    Alert.alert(AlertMessage.TOKEN.title, AlertMessage.TOKEN.message);
  },
  elseAlert: () => {
    Alert.alert(AlertMessage.ELSE.title, AlertMessage.ELSE.message);
  },
  wrongOTPAlert: () => {
    Alert.alert(AlertMessage.WRONG_OTP.title, AlertMessage.WRONG_OTP.message);
  },
  expiredOTPAlert: () => {
    Alert.alert(AlertMessage.EXPIRED_OTP.title, AlertMessage.EXPIRED_OTP.message);
  },
  badPhoneNumberAlert: async () => {
    Alert.alert(AlertMessage.BAD_PHONE_NUMBER.title, AlertMessage.BAD_PHONE_NUMBER.message);
  },
  paymentAlert: () => {
    Alert.alert(AlertMessage.PAYMENT.title, AlertMessage.PAYMENT.message);
  },
  logoutAlert: async (logout: () => Promise<boolean>) => {
    let val = {logout: false, success: false};
    await Alert.alert(AlertMessage.LOGOUT.title, AlertMessage.LOGOUT.message, [
      {
        text: 'Yes',
        onPress: async () => {
          val.logout = true;
          val.success = await logout();
        },
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
    return val;
  },
  outOfStockAlert: (deleted_items: string[], deleted_options: {item: string; option: string}[]) => {
    Alert.alert(
      AlertMessage.OUT_OF_STOCK.title,
      AlertMessage.OUT_OF_STOCK.message +
        deleted_items.join(', ') +
        deleted_options.map(option => option.item + ' - ' + option.option).join(', '),
    );
  },
};
