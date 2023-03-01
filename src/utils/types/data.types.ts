import {Cafe, CurrentOrder, Item, Option, OrderItem, PastOrder, UsualOrder} from '../../models';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState, GlobalActionName, OrderingActionName, SignInActionName, TrackOrderActionName} from './enums';

export type HubPayload = {
  event: string;
  data?: any;
  message?: string;
};

// Dictionary from the minute of the day to the list of orders currently running at that minute.
export type DigitalQueue = {[minute: number]: string[]};

export type Payment = 'card' | 'google' | 'apple';

export type GlobalState = {
  auth_state: AuthState;
  current_user: LocalUser | null;
  auth_user: AuthUser | null;
  network_status: boolean;
  synced: boolean;
  device_token: string;
  current_order: CurrentOrder | null;
  loading: boolean;
};

export type CommonBasketItem = {
  name: string;
  quantity: number;
  options: Option[];
};

export type AuthUser = {
  sub: string;
  user: CognitoUser;
};

export type TrackOrderState = {
  destination: {latitude: number; longitude: number} | undefined;
  ratings: PreRating[];
};

export type OrderingState = {
  current_shop_id: string | null;
  scheduled_time: number;
  specific_basket: OrderItem[];
  specific_items: Item[];
  cafes: Cafe[];
  payment_id: string | null;
};

export type SignInState = {
  trials: number;
  blocked_time: number;
  phone_number: string;
  session: CognitoUser | null;
};

export type Location = {latitude: number; longitude: number};

export type MapLocation = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export type PreferenceWeights = {
  queue: number;
  personal_taste: number;
  general_taste: number;
  distance: number;
  price: number;
};

export type ShopMarker = {
  name: string;
  description: string;
  coords: Location;
  image: string;
  is_open: boolean;
};

export type GlobalAction =
  | {type: GlobalActionName.SET_CURRENT_USER; payload: LocalUser | null}
  | {type: GlobalActionName.SET_AUTH_STATE; payload: AuthState}
  | {type: GlobalActionName.SET_AUTH_USER; payload: AuthUser | null}
  | {type: GlobalActionName.SET_SYNCED; payload: boolean}
  | {type: GlobalActionName.SET_DEVICE_TOKEN; payload: string}
  | {type: GlobalActionName.SET_CURRENT_ORDER; payload: CurrentOrder | null}
  | {type: GlobalActionName.SET_LOADING; payload: boolean}
  | {type: GlobalActionName.SET_NETWORK_STATUS; payload: boolean};

export type TrackOrderAction =
  | {type: TrackOrderActionName.SET_RATINGS; payload: PreRating[]}
  | {type: TrackOrderActionName.SET_DESTINATION; payload: {latitude: number; longitude: number}};

export type OrderingAction =
  | {type: OrderingActionName.SET_CURRENT_SHOP_ID; payload: string}
  | {type: OrderingActionName.SET_SPECIFIC_BASKET; payload: OrderItem[]}
  | {type: OrderingActionName.SET_SCHEDULED_TIME; payload: number}
  | {type: OrderingActionName.SET_SPECIFIC_ITEMS; payload: Item[]}
  | {type: OrderingActionName.SET_PAYMENT_ID; payload: string}
  | {type: OrderingActionName.SET_CAFES; payload: Cafe[]};

export type SignInAction =
  | {type: SignInActionName.SET_TRIALS; payload: number}
  | {type: SignInActionName.SET_BLOCKED_TIME; payload: number}
  | {type: SignInActionName.SET_SESSION; payload: CognitoUser}
  | {type: SignInActionName.SET_PHONE; payload: string};

export type PreRating = {
  rating: number;
  itemID: string;
};

export type PaymentParams = {
  amount: number;
  currency: string;
  name?: string;
  phone?: string;
  customer_id?: string;
};

export type LocalUser = {
  id: string;
  phone: string;
  name: string;
  payment_method: string | null | undefined;
  the_usual: UsualOrder | null | undefined;
  customer_id: string | null | undefined;
  device_token: string;
  past_orders: PastOrder[];
};
