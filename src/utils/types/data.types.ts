import {Cafe, CurrentOrder, Item, OrderItem, UsualOrder} from '../../models';
import {AuthState} from '../enums';
import {CognitoUser} from 'amazon-cognito-identity-js';

export type HubPayload = {
  event: string;
  data?: any;
  message?: string;
};

// Dictionary from the minute of the day to the list of orders currently running at that minute.
export type DigitalQueue = {[minute: number]: string[]};

export type GlobalState = {
  auth_state: AuthState;
  current_user: LocalUser | null;
  auth_user: CognitoUser | null;
  network_status: boolean;
};

export type TrackOrderState = {
  current_order: CurrentOrder | null;
  is_locatable: boolean;
  location: Location | null;
};

export type OrderingState = {
  current_shop: Cafe | null;
  common_basket: OrderItem[];
  specific_basket: Item[];
  scheduled_time: number;
  common_items: Item[];
};

export type Location = {latitude: number; longitude: number};

export type PreferenceWeights = {
  queue: number;
  personal_taste: number;
  general_taste: number;
  distance: number;
  price: number;
};

export type GlobalAction =
  | {type: 'SET_CURRENT_USER'; payload: LocalUser | null}
  | {type: 'SET_AUTH_STATE'; payload: AuthState}
  | {type: 'SET_AUTH_USER'; payload: CognitoUser | null}
  | {type: 'SET_NETWORK_STATUS'; payload: boolean};

export type TrackOrderAction =
  | {type: 'SET_CURRENT_ORDER'; payload: CurrentOrder}
  | {type: 'SET_IS_LOCATABLE'; payload: boolean}
  | {type: 'SET_LOCATION'; payload: Location | null};

export type OrderingAction =
  | {type: 'SET_CURRENT_SHOP'; payload: Cafe | null}
  | {type: 'SET_COMMON_BASKET'; payload: OrderItem[]}
  | {type: 'SET_SPECIFIC_BASKET'; payload: Item[]}
  | {type: 'SET_SCHEDULED_TIME'; payload: number}
  | {type: 'SET_COMMON_ITEMS'; payload: Item[]};

export type PreRating = {
  rating: number;
  itemID: string;
};

export type LocalUser = {
  id: string;
  is_signed_in: boolean;
  phone: string;
  name: string;
  payment_method: string | null | undefined;
  the_usual: UsualOrder | null | undefined;
};
