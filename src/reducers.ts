import {
  GlobalAction,
  GlobalState,
  OrderingAction,
  OrderingState,
  TrackOrderAction,
  TrackOrderState,
} from './utils/types/data.types';
export const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {...state, current_user: action.payload};

    case 'SET_AUTH_STATE':
      return {...state, auth_state: action.payload};
    case 'SET_AUTH_USER':
      return {...state, auth_user: action.payload};
    case 'SET_NETWORK_STATUS':
      return {...state, network_status: action.payload};
    default:
      return state;
  }
};

export const trackOrderReducer = (state: TrackOrderState, action: TrackOrderAction): TrackOrderState => {
  switch (action.type) {
    case 'SET_CURRENT_ORDER':
      return {...state, current_order: action.payload};
    case 'SET_LOCATION':
      return {...state, location: action.payload};
    case 'SET_RATINGS':
      return {...state, ratings: action.payload};
    case 'SET_IS_LOCATABLE':
      return {...state, is_locatable: action.payload};
    case 'SET_IS_USER_CENTERED':
      return {...state, is_user_centered: action.payload};
    case 'SET_IS_MANUALLY_CENTERED':
      return {...state, manually_centered: action.payload};
    case 'SET_MAP_REGION':
      return {...state, map_region: action.payload};
    default:
      return state;
  }
};

export const orderingReducer = (state: OrderingState, action: OrderingAction): OrderingState => {
  switch (action.type) {
    case 'SET_COMMON_ITEMS':
      return {...state, common_items: action.payload};
    case 'SET_SPECIFIC_ITEMS':
      return {...state, specific_items: action.payload};
    case 'SET_PAYMENT_ID':
      return {...state, payment_id: action.payload};
    case 'SET_SCHEDULED_TIME':
      return {...state, scheduled_time: action.payload};
    case 'SET_COMMON_BASKET':
      return {...state, common_basket: action.payload};
    case 'SET_SPECIFIC_BASKET':
      return {...state, specific_basket: action.payload};
    case 'SET_CURRENT_SHOP_ID':
      return {...state, current_shop_id: action.payload};
    default:
      return state;
  }
};
