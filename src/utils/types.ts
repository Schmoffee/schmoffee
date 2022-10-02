import {Cafe, Item, OrderItem, User} from '../models';
import {ReactNode} from 'react';
import {AuthState} from './enums';
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
  current_user: User | null;
  current_shop: Cafe | null;
  common_basket: OrderItem[];
  specific_basket: Item[];
  scheduled_time: Date | null;
  common_items: Item[];
  auth_user: CognitoUser | null;
  network_status: boolean;
};

export type GlobalAction =
  | {type: 'SET_CURRENT_USER'; payload: User | null}
  | {type: 'SET_CURRENT_SHOP'; payload: Cafe | null}
  | {type: 'SET_COMMON_BASKET'; payload: OrderItem[]}
  | {type: 'SET_SPECIFIC_BASKET'; payload: Item[]}
  | {type: 'SET_SCHEDULED_TIME'; payload: Date | null}
  | {type: 'SET_COMMON_ITEMS'; payload: Item[]}
  | {type: 'SET_AUTH_STATE'; payload: AuthState}
  | {type: 'SET_AUTH_USER'; payload: CognitoUser | null}
  | {type: 'SET_NETWORK_STATUS'; payload: boolean};

export type Props = {
  children: ReactNode;
  title: string;
};

export interface FieldError {
  error?: string;
}

export interface FieldBase extends FieldError {
  value: string;
}

export interface FieldCode extends FieldError {
  value: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}
