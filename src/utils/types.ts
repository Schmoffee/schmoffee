import {Day, OptionType, Status} from '../models';
import {ReactNode} from 'react';

export type CurrentOrder = {
  items: OrderItem[];
  user: User;
  shop?: Shop | null;
  sent_time?: Date | null;
  total?: number | 0;
  order_info: OrderInfo;
};

export enum Section {
  COFFEES = 'COFFEES',
  TEAS = 'TEAS',
  JUICES = 'JUICES',
  SNACKS = 'SNACKS',
}

// Dictionary from the minute of the day to the list of orders currently running at that minute.
export type DigitalQueue = {[minute: number]: string[]};

export type Menu = {
  [key in Section]: Item[];
};

export type GlobalState = {
  current_user: User | null;
  current_shop: Shop | null;
  common_basket: OrderItem[];
  specific_basket: Item[];
  scheduled_time: Date | null;
  the_usual: CurrentOrder | null;
};

export type OrderItem = {
  name: string;
  price: number;
  options: OrderOption[] | null;
};

export type OrderOption = {
  name: string;
  price: number;
  option_type: OptionType | keyof typeof OptionType;
};

export type OrderInfo = {
  status: Status | keyof typeof Status;
  accepted_time?: Date | null;
  rejected_time?: Date | null;
  ready_time?: Date | null;
  collected_time?: Date | null;
  received_time?: Date | null;
  scheduled_times: Date[];
  preparing_time?: Date | null;
};

export type Option = {
  name: string;
  shop_id?: string | null;
  option_type: OptionType | keyof typeof OptionType;
  price: number;
  image?: string | null;
  is_in_stock: boolean;
};

export type PastOrder = {
  items: OrderItem[];
  user: string;
  shop: string;
  final_status: Status | keyof typeof Status;
  total: number;
  order_info: OrderInfo;
  sent_time: string;
};

export type Item = {
  shop_id: string | null;
  name: string;
  price: number;
  image?: string | null;
  rating?: number | null;
  is_common: boolean;
  is_in_stock: boolean;
  preparation_time: number;
};

export type Shop = {
  readonly name: string;
  readonly email: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly menu: Menu;
  readonly opening_hours: number[];
  readonly is_open: boolean;
  readonly opening_days?: Day[] | keyof typeof Day | null;
  readonly image?: string | null;
  readonly description: string;
  readonly digital_queue: DigitalQueue;
};

export type Rating = {
  order_id: string;
  user_id: string;
  shop_id: string;
  item_id: string;
  rating: number;
};

export type User = {
  device_id?: string;
  phone?: string | null;
  name?: string | null;
  payment_method?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_locatable?: boolean | null;
  the_usual?: string | null;
};

export type GlobalAction =
  | {type: 'SET_CURRENT_USER'; payload: User | null}
  | {type: 'SET_CURRENT_SHOP'; payload: Shop | null}
  | {type: 'SET_COMMON_BASKET'; payload: OrderItem[]}
  | {type: 'SET_SPECIFIC_BASKET'; payload: Item[]}
  | {type: 'SET_THE_USUAL'; payload: CurrentOrder | null}
  | {type: 'SET_SCHEDULED_TIME'; payload: Date | null};

export type Props = {
  children: ReactNode;
  title: string;
};
