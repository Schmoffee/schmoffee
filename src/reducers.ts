import {GlobalAction, GlobalState} from './utils/types';
export const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case 'SET_COMMON_BASKET':
      return {...state, common_basket: action.payload};
    case 'SET_SPECIFIC_BASKET':
      return {...state, specific_basket: action.payload};
    case 'SET_CURRENT_SHOP':
      return {...state, current_shop: action.payload};
    case 'SET_CURRENT_USER':
      return {...state, current_user: action.payload};
    case 'SET_SCHEDULED_TIME':
      return {...state, scheduled_time: action.payload};
    case 'SET_AUTH_STATE':
      return {...state, auth_state: action.payload};
    case 'SET_COMMON_ITEMS':
      return {...state, common_items: action.payload};
    case 'SET_AUTH_USER':
      return {...state, auth_user: action.payload};
    case 'SET_NETWORK_STATUS':
      return {...state, network_status: action.payload};
    default:
      return state;
  }
};
