import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum OptionType {
  BEAN = "BEAN",
  SYRUP = "SYRUP",
  MILK = "MILK"
}

export enum PlatformType {
  IOS = "IOS",
  ANDROID = "ANDROID"
}

export enum ItemType {
  COFFEE = "COFFEE",
  COLD_DRINKS = "COLD_DRINKS",
  SNACKS = "SNACKS"
}

export enum OrderStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PREPARING = "PREPARING",
  READY = "READY",
  COLLECTED = "COLLECTED",
  RECEIVED = "RECEIVED",
  SENT = "SENT"
}

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export declare class UsualOrder {
  readonly items: OrderItem[];
  readonly schedule: number;
  readonly cafeID: string;
  constructor(init: ModelInit<UsualOrder>);
}

export declare class OrderItem {
  readonly quantity: number;
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly preparation_time: number;
  readonly options?: OrderOption[] | null;
  constructor(init: ModelInit<OrderItem>);
}

export declare class OrderOption {
  readonly name: string;
  readonly price: number;
  readonly option_type: OptionType | keyof typeof OptionType;
  constructor(init: ModelInit<OrderOption>);
}

export declare class UserInfo {
  readonly name: string;
  readonly phone: string;
  readonly device_token: string;
  readonly platform: PlatformType | keyof typeof PlatformType;
  constructor(init: ModelInit<UserInfo>);
}

export declare class OrderInfo {
  readonly accepted_time?: string | null;
  readonly rejected_time?: string | null;
  readonly ready_time?: string | null;
  readonly collected_time?: string | null;
  readonly received_time?: string | null;
  readonly scheduled_times: string[];
  readonly preparing_time?: string | null;
  readonly sent_time: string;
  readonly rejection_justification?: string | null;
  readonly color: string;
  readonly pin: string;
  readonly unique_id: string;
  constructor(init: ModelInit<OrderInfo>);
}

type ErrorMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PastOrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CurrentOrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RatingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CafeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Error {
  readonly id: string;
  readonly user_phone?: string | null;
  readonly time?: string | null;
  readonly description?: string | null;
  readonly type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Error, ErrorMetaData>);
  static copyOf(source: Error, mutator: (draft: MutableModel<Error, ErrorMetaData>) => MutableModel<Error, ErrorMetaData> | void): Error;
}

export declare class Option {
  readonly id: string;
  readonly name: string;
  readonly option_type: OptionType | keyof typeof OptionType;
  readonly price: number;
  readonly image?: string | null;
  readonly is_in_stock: boolean;
  readonly itemID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Option, OptionMetaData>);
  static copyOf(source: Option, mutator: (draft: MutableModel<Option, OptionMetaData>) => MutableModel<Option, OptionMetaData> | void): Option;
}

export declare class PastOrder {
  readonly id: string;
  readonly items: OrderItem[];
  readonly order_info: OrderInfo;
  readonly cafeID: string;
  readonly userID: string;
  readonly final_status: OrderStatus | keyof typeof OrderStatus;
  readonly total: number;
  readonly payment_id: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PastOrder, PastOrderMetaData>);
  static copyOf(source: PastOrder, mutator: (draft: MutableModel<PastOrder, PastOrderMetaData>) => MutableModel<PastOrder, PastOrderMetaData> | void): PastOrder;
}

export declare class CurrentOrder {
  readonly id: string;
  readonly items: OrderItem[];
  readonly total: number;
  readonly order_info: OrderInfo;
  readonly cafeID: string;
  readonly user_info: UserInfo;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly payment_id: string;
  readonly display: boolean;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<CurrentOrder, CurrentOrderMetaData>);
  static copyOf(source: CurrentOrder, mutator: (draft: MutableModel<CurrentOrder, CurrentOrderMetaData>) => MutableModel<CurrentOrder, CurrentOrderMetaData> | void): CurrentOrder;
}

export declare class Item {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly is_common: boolean;
  readonly is_in_stock: boolean;
  readonly preparation_time: number;
  readonly cafeID: string;
  readonly ratings?: (Rating | null)[] | null;
  readonly options?: (Option | null)[] | null;
  readonly type?: ItemType | keyof typeof ItemType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Item, ItemMetaData>);
  static copyOf(source: Item, mutator: (draft: MutableModel<Item, ItemMetaData>) => MutableModel<Item, ItemMetaData> | void): Item;
}

export declare class Rating {
  readonly id: string;
  readonly rating: number;
  readonly cafeID: string;
  readonly userID: string;
  readonly itemID: string;
  readonly order: PastOrder;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ratingOrderId: string;
  constructor(init: ModelInit<Rating, RatingMetaData>);
  static copyOf(source: Rating, mutator: (draft: MutableModel<Rating, RatingMetaData>) => MutableModel<Rating, RatingMetaData> | void): Rating;
}

export declare class Cafe {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly opening_hours: string[];
  readonly is_open: boolean;
  readonly opening_days?: Day[] | keyof typeof Day | null;
  readonly image?: string | null;
  readonly description: string;
  readonly digital_queue: string;
  readonly menu?: Item[] | null;
  readonly past_orders?: (PastOrder | null)[] | null;
  readonly current_orders?: (CurrentOrder | null)[] | null;
  readonly ratings?: (Rating | null)[] | null;
  readonly address: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Cafe, CafeMetaData>);
  static copyOf(source: Cafe, mutator: (draft: MutableModel<Cafe, CafeMetaData>) => MutableModel<Cafe, CafeMetaData> | void): Cafe;
}

export declare class User {
  readonly id: string;
  readonly phone: string;
  readonly name: string;
  readonly payment_method?: string | null;
  readonly ratings?: (Rating | null)[] | null;
  readonly past_orders?: (PastOrder | null)[] | null;
  readonly the_usual?: UsualOrder | null;
  readonly customer_id?: string | null;
  readonly device_token: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}