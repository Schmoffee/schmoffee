import React from 'react';
import {
  GlobalAction,
  GlobalState,
  OrderingAction,
  OrderingState,
  SignInAction,
  SignInState,
  TrackOrderAction,
  TrackOrderState,
} from './utils/types/data.types';
import {AuthState} from './utils/types/enums';

export const globalData: GlobalState = {
  auth_state: AuthState.SIGNED_OUT,
  current_user: null,
  auth_user: null,
  network_status: false,
  synced: false,
  device_token: '',
};

export const trackOrderData: TrackOrderState = {
  current_order: null,
  is_locatable: false,
  location: null,
  ratings: [],
  manually_centered: false,
  map_region: undefined,
  is_user_centered: true,
};

export const orderingData: OrderingState = {
  current_shop_id: '51563da2-3287-466a-9b3b-cb3f93f29db4',
  common_basket: [],
  scheduled_time: 5,
  specific_basket: [],
  common_items: [],
  specific_items: [],
  payment_id: null,
};

export const signInData: SignInState = {
  blocked_time: 0,
  trials: 0,
  session: null,
  phone_number: '',
};

const GlobalContext = React.createContext<{
  global_state: GlobalState;
  global_dispatch: React.Dispatch<GlobalAction>;
}>({
  global_state: globalData,
  global_dispatch: () => null,
});

const TrackOrderContext = React.createContext<{
  track_order_state: TrackOrderState;
  track_order_dispatch: React.Dispatch<TrackOrderAction>;
}>({
  track_order_state: trackOrderData,
  track_order_dispatch: () => null,
});

const OrderingContext = React.createContext<{
  ordering_state: OrderingState;
  ordering_dispatch: React.Dispatch<OrderingAction>;
}>({
  ordering_state: orderingData,
  ordering_dispatch: () => null,
});

const SignInContext = React.createContext<{
  sign_in_state: SignInState;
  sign_in_dispatch: React.Dispatch<SignInAction>;
  sendOTP:(phoneNumber: string) => void;
}>({
  sign_in_state: signInData,
  sign_in_dispatch: () => null,
  sendOTP: () => null,
});

export {TrackOrderContext, GlobalContext, OrderingContext, SignInContext};
