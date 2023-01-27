export enum ErrorTypes {
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  ELSE = 'ELSE',
}

export enum AuthState {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  CONFIRMING_OTP = 'CONFIRMING_OTP',
  CONFIRMING_OTP_FAILED = 'CONFIRMING_OTP_FAILED',
  SIGNING_UP_FAILED = 'SIGNING_UP_FAILED',
  SIGNED_UP = 'SIGNING_UP',
  SIGNING_IN_FAILED = 'SIGNING_IN_FAILED',
  SIGNING_OUT_FAILED = 'SIGNING_OUT_FAILED',
}

export enum GlobalActionName {
  SET_CURRENT_USER,
  SET_AUTH_STATE,
  SET_AUTH_USER,
  SET_SYNCED,
  SET_DEVICE_TOKEN,
  SET_NETWORK_STATUS,
}

export enum TrackOrderActionName {
  SET_CURRENT_ORDER,
  SET_RATINGS,
  SET_ADDRESS,
}
export enum OrderingActionName {
  SET_CURRENT_SHOP_ID,
  SET_SPECIFIC_BASKET,
  SET_SCHEDULED_TIME,
  SET_SPECIFIC_ITEMS,
  SET_PAYMENT_ID,
  SET_CAFES,
}

export enum SignInActionName {
  SET_TRIALS,
  SET_BLOCKED_TIME,
  SET_SESSION,
  SET_PHONE,
}
