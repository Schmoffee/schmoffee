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
    message: 'You entered the wrong OTP, ask for a new one.',
  },
  EXPIRED_OTP: {
    title: 'OTP Expired',
    message: 'This code has expired. Please request a new one.',
  },
  BAD_PHONE_NUMBER: {
    title: 'Invalid Phone Number',
    message:
      "This number is not registered with us. Please check the number and try again. If you don't have an account, please sign up.",
  },
  ELSE: {
    title: 'Rare Error!',
    message: "This is a funky error! We don't really know what went wrong, but something went wrong.",
  },
  SIGN_IN_ERROR: {
    title: 'Sign In Error',
    message: 'There was an error signing in. Please try again.',
  },
  SIGN_UP_ERROR: {
    title: 'Sign Up Error',
    message: 'There was an error signing up. Please try again.',
  },
  USERNAME_EXISTS: {
    title: 'Phone number already registered',
    message: 'This phone number is already registered. Try logging in.',
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
  ORDER_RUNNING: {
    title: 'Order running',
    message: 'You already have a current order, you can only have one order at a time.',
  },
  OUT_OF_STOCK: {
    title: 'Out of stock',
    message:
      'Apologies, we had to remove the following items and/or options from your basket because they suddenly went out of stock: ',
  },
  CONFIRM_OTP: {
    title: 'Confirm OTP',
    message: 'You are about to send the OTP. You only have one attempt per OTP. Are you sure?',
  },
};

export const Alerts = {
  offlineAlert: () => {
    Alert.alert(AlertMessage.OFFLINE.title, AlertMessage.OFFLINE.message);
  },
  databaseAlert: () => {
    Alert.alert(AlertMessage.DATABASE.title, AlertMessage.DATABASE.message);
  },
  phoneExistsAlert: () => {
    Alert.alert(AlertMessage.USERNAME_EXISTS.title, AlertMessage.USERNAME_EXISTS.message);
  },
  signUpErrorAlert: () => {
    Alert.alert(AlertMessage.SIGN_UP_ERROR.title, AlertMessage.SIGN_UP_ERROR.message);
  },
  tokenAlert: () => {
    Alert.alert(AlertMessage.TOKEN.title, AlertMessage.TOKEN.message);
  },
  elseAlert: () => {
    Alert.alert(AlertMessage.ELSE.title, AlertMessage.ELSE.message);
  },
  orderAlert: () => {
    Alert.alert(AlertMessage.ORDER_RUNNING.title, AlertMessage.ORDER_RUNNING.message);
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
  signInErrorAlert: () => {
    Alert.alert(AlertMessage.SIGN_IN_ERROR.title, AlertMessage.SIGN_IN_ERROR.message);
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
  deleteAccountAlert: async () => {
    let deleteAccount = false;
    await Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
      {
        text: 'Yes',
        onPress: async () => {
          deleteAccount = true;
        },
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
    return deleteAccount;
  },

  confirmOTPAlert: async (confirmOTP: () => Promise<void>) => {
    await Alert.alert(AlertMessage.CONFIRM_OTP.title, AlertMessage.CONFIRM_OTP.message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await confirmOTP();
        },
      },
    ]);
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
