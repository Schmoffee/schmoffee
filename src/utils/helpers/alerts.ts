import {Alert} from 'react-native';
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
    title: 'Storage error',
    message: "An error occured when accessing the app's local storage, want to try that again ?",
  },
  NETWORK: {
    title: 'Network error',
    message: 'An error occurred when connecting to the payment server...',
  },
  LOGOUT: {
    title: 'Logout',
    message: 'You are about to logout, you will lose your current basket, are you sure?',
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
  badPhoneNumberAlert: () => {
    Alert.alert(AlertMessage.BAD_PHONE_NUMBER.title, AlertMessage.BAD_PHONE_NUMBER.message);
  },
  LocationAlert: () => {
    Alert.alert(AlertMessage.LOCATION.title, AlertMessage.LOCATION.message, [
      {
        text: 'OK',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  },
  StorageAlert: () => {
    Alert.alert(AlertMessage.STORAGE.title, AlertMessage.STORAGE.message);
  },
  networkAlert: () => {
    Alert.alert(AlertMessage.NETWORK.title, AlertMessage.NETWORK.message);
  },
  logoutAlert: (logout: () => void) => {
    Alert.alert(AlertMessage.LOGOUT.title, AlertMessage.LOGOUT.message, [
      {text: 'Yes', onPress: () => logout()},
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  },
};
