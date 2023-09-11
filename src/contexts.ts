import React from 'react';
import {
  GlobalAction,
  GlobalState,
  MapLocation,
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
  current_order: null,
};

export const trackOrderData: TrackOrderState = {
  ratings: [],
  destination: undefined,
};

export const orderingData: OrderingState = {
  current_shop_id: 'c8ac8211-c3e5-42bb-8651-d20afdcb3dc9',
  scheduled_time: 5,
  specific_basket: [],
  specific_items: [],
  payment_id: null,
  cafes: [],
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

const MapContext = React.createContext<{
  location: MapLocation | null;
}>({
  location: null,
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
  sendOTP: (phoneNumber: string) => Promise<boolean>;
}>({
  sign_in_state: signInData,
  sign_in_dispatch: () => null,
  sendOTP: () => Promise.resolve(false),
});

export {TrackOrderContext, GlobalContext, OrderingContext, SignInContext, MapContext};
