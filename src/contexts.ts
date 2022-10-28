import React from 'react';
import {GlobalState, OrderingState, TrackOrderState} from './utils/types/data.types';
import {AuthState} from './utils/types/enums';

export const globalData: GlobalState = {
  auth_state: AuthState.SIGNED_OUT,
  current_user: null,
  auth_user: null,
  network_status: false,
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
  current_shop_id: null,
  common_basket: [],
  scheduled_time: 5,
  specific_basket: [],
  common_items: [],
  specific_items: [],
  payment_id: null,
};

const GlobalContext = React.createContext<{
  global_state: GlobalState;
  global_dispatch: React.Dispatch<any>;
}>({
  global_state: globalData,
  global_dispatch: () => null,
});

const TrackOrderContext = React.createContext<{
  track_order_state: TrackOrderState;
  track_order_dispatch: React.Dispatch<any>;
}>({
  track_order_state: trackOrderData,
  track_order_dispatch: () => null,
});

const OrderingContext = React.createContext<{
  ordering_state: OrderingState;
  ordering_dispatch: React.Dispatch<any>;
}>({
  ordering_state: orderingData,
  ordering_dispatch: () => null,
});

export {TrackOrderContext, GlobalContext, OrderingContext};
