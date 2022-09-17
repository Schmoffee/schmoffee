import {Cafe, CurrentOrder, Item, OrderItem, User} from '../models';
import {ReactNode} from 'react';
import {AuthState} from './enums';

export type HubPayload = {
  event: string;
  data?: any;
  message?: string;
};

// Dictionary from the minute of the day to the list of orders currently running at that minute.
export type DigitalQueue = {[minute: number]: string[]};

export type GlobalState = {
  auth_state: AuthState;
  current_user: User | null;
  current_shop: Cafe | null;
  common_basket: OrderItem[];
  specific_basket: Item[];
  scheduled_time: Date | null;
  the_usual: CurrentOrder | null;
  common_items: Item[];
};

export type GlobalAction =
  | {type: 'SET_CURRENT_USER'; payload: User | null}
  | {type: 'SET_CURRENT_SHOP'; payload: Cafe | null}
  | {type: 'SET_COMMON_BASKET'; payload: OrderItem[]}
  | {type: 'SET_SPECIFIC_BASKET'; payload: Item[]}
  | {type: 'SET_THE_USUAL'; payload: CurrentOrder | null}
  | {type: 'SET_SCHEDULED_TIME'; payload: Date | null}
  | {type: 'SET_COMMON_ITEMS'; payload: Item[]}
  | {type: 'SET_AUTH_STATE'; payload: AuthState};

export type Props = {
  children: ReactNode;
  title: string;
};
