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
import {GlobalActionName, OrderingActionName, SignInActionName, TrackOrderActionName} from './utils/types/enums';
export const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case GlobalActionName.SET_CURRENT_USER:
      return {...state, current_user: action.payload};
    case GlobalActionName.SET_AUTH_STATE:
      return {...state, auth_state: action.payload};
    case GlobalActionName.SET_AUTH_USER:
      return {...state, auth_user: action.payload};
    case GlobalActionName.SET_NETWORK_STATUS:
      return {...state, network_status: action.payload};
    case GlobalActionName.SET_SYNCED:
      return {...state, synced: action.payload};
    case GlobalActionName.SET_CURRENT_ORDER:
      return {...state, current_order: action.payload};
    case GlobalActionName.SET_DEVICE_TOKEN:
      return {...state, device_token: action.payload};
    default:
      return state;
  }
};

export const trackOrderReducer = (state: TrackOrderState, action: TrackOrderAction): TrackOrderState => {
  switch (action.type) {
    case TrackOrderActionName.SET_RATINGS:
      return {...state, ratings: action.payload};
    case TrackOrderActionName.SET_SHOP:
      return {...state, shop: action.payload};
    default:
      return state;
  }
};

export const orderingReducer = (state: OrderingState, action: OrderingAction): OrderingState => {
  switch (action.type) {
    case OrderingActionName.SET_SPECIFIC_ITEMS:
      return {...state, specific_items: action.payload};
    case OrderingActionName.SET_PAYMENT_ID:
      return {...state, payment_id: action.payload};
    case OrderingActionName.SET_SCHEDULED_TIME:
      return {...state, scheduled_time: action.payload};
    case OrderingActionName.SET_SPECIFIC_BASKET:
      return {...state, specific_basket: action.payload};
    case OrderingActionName.SET_CURRENT_SHOP_ID:
      return {...state, current_shop_id: action.payload};
    case OrderingActionName.SET_CAFES:
      return {...state, cafes: action.payload};
    default:
      return state;
  }
};

export const signInReducer = (state: SignInState, action: SignInAction): SignInState => {
  switch (action.type) {
    case SignInActionName.SET_TRIALS:
      return {...state, trials: action.payload};
    case SignInActionName.SET_BLOCKED_TIME:
      return {...state, blocked_time: action.payload};
    case SignInActionName.SET_PHONE:
      return {...state, phone_number: action.payload};
    case SignInActionName.SET_SESSION:
      return {...state, session: action.payload};
    default:
      return state;
  }
};
