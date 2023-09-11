import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

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

export enum OptionType {
  BEAN = "BEAN",
  SYRUP = "SYRUP",
  MILK = "MILK"
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

type EagerUsualOrder = {
  readonly items: OrderItem[];
  readonly schedule: number;
  readonly cafeID: string;
}

type LazyUsualOrder = {
  readonly items: OrderItem[];
  readonly schedule: number;
  readonly cafeID: string;
}

export declare type UsualOrder = LazyLoading extends LazyLoadingDisabled ? EagerUsualOrder : LazyUsualOrder

export declare const UsualOrder: (new (init: ModelInit<UsualOrder>) => UsualOrder)

type EagerUserInfo = {
  readonly name: string;
  readonly phone: string;
  readonly device_token: string;
  readonly platform: PlatformType | keyof typeof PlatformType;
}

type LazyUserInfo = {
  readonly name: string;
  readonly phone: string;
  readonly device_token: string;
  readonly platform: PlatformType | keyof typeof PlatformType;
}

export declare type UserInfo = LazyLoading extends LazyLoadingDisabled ? EagerUserInfo : LazyUserInfo

export declare const UserInfo: (new (init: ModelInit<UserInfo>) => UserInfo)

type EagerOrderOption = {
  readonly name: string;
  readonly price: number;
  readonly option_type: OptionType | keyof typeof OptionType;
}

type LazyOrderOption = {
  readonly name: string;
  readonly price: number;
  readonly option_type: OptionType | keyof typeof OptionType;
}

export declare type OrderOption = LazyLoading extends LazyLoadingDisabled ? EagerOrderOption : LazyOrderOption

export declare const OrderOption: (new (init: ModelInit<OrderOption>) => OrderOption)

type EagerOrderItem = {
  readonly quantity: number;
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly preparation_time: number;
  readonly options?: OrderOption[] | null;
}

type LazyOrderItem = {
  readonly quantity: number;
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly preparation_time: number;
  readonly options?: OrderOption[] | null;
}

export declare type OrderItem = LazyLoading extends LazyLoadingDisabled ? EagerOrderItem : LazyOrderItem

export declare const OrderItem: (new (init: ModelInit<OrderItem>) => OrderItem)

type EagerOrderInfo = {
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
}

type LazyOrderInfo = {
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
}

export declare type OrderInfo = LazyLoading extends LazyLoadingDisabled ? EagerOrderInfo : LazyOrderInfo

export declare const OrderInfo: (new (init: ModelInit<OrderInfo>) => OrderInfo)

type EagerError = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Error, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user_phone?: string | null;
  readonly time?: string | null;
  readonly description?: string | null;
  readonly type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyError = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Error, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user_phone?: string | null;
  readonly time?: string | null;
  readonly description?: string | null;
  readonly type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Error = LazyLoading extends LazyLoadingDisabled ? EagerError : LazyError

export declare const Error: (new (init: ModelInit<Error>) => Error) & {
  copyOf(source: Error, mutator: (draft: MutableModel<Error>) => MutableModel<Error> | void): Error;
}

type EagerOption = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Option, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly option_type: OptionType | keyof typeof OptionType;
  readonly price: number;
  readonly image?: string | null;
  readonly is_in_stock: boolean;
  readonly itemID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOption = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Option, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly option_type: OptionType | keyof typeof OptionType;
  readonly price: number;
  readonly image?: string | null;
  readonly is_in_stock: boolean;
  readonly itemID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Option = LazyLoading extends LazyLoadingDisabled ? EagerOption : LazyOption

export declare const Option: (new (init: ModelInit<Option>) => Option) & {
  copyOf(source: Option, mutator: (draft: MutableModel<Option>) => MutableModel<Option> | void): Option;
}

type EagerPastOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PastOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

type LazyPastOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PastOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

export declare type PastOrder = LazyLoading extends LazyLoadingDisabled ? EagerPastOrder : LazyPastOrder

export declare const PastOrder: (new (init: ModelInit<PastOrder>) => PastOrder) & {
  copyOf(source: PastOrder, mutator: (draft: MutableModel<PastOrder>) => MutableModel<PastOrder> | void): PastOrder;
}

type EagerCurrentOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CurrentOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

type LazyCurrentOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CurrentOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

export declare type CurrentOrder = LazyLoading extends LazyLoadingDisabled ? EagerCurrentOrder : LazyCurrentOrder

export declare const CurrentOrder: (new (init: ModelInit<CurrentOrder>) => CurrentOrder) & {
  copyOf(source: CurrentOrder, mutator: (draft: MutableModel<CurrentOrder>) => MutableModel<CurrentOrder> | void): CurrentOrder;
}

type EagerItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Item, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

type LazyItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Item, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly is_common: boolean;
  readonly is_in_stock: boolean;
  readonly preparation_time: number;
  readonly cafeID: string;
  readonly ratings: AsyncCollection<Rating>;
  readonly options: AsyncCollection<Option>;
  readonly type?: ItemType | keyof typeof ItemType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Item = LazyLoading extends LazyLoadingDisabled ? EagerItem : LazyItem

export declare const Item: (new (init: ModelInit<Item>) => Item) & {
  copyOf(source: Item, mutator: (draft: MutableModel<Item>) => MutableModel<Item> | void): Item;
}

type EagerCafe = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Cafe, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

type LazyCafe = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Cafe, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
  readonly menu: AsyncCollection<Item>;
  readonly past_orders: AsyncCollection<PastOrder>;
  readonly current_orders: AsyncCollection<CurrentOrder>;
  readonly ratings: AsyncCollection<Rating>;
  readonly address: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Cafe = LazyLoading extends LazyLoadingDisabled ? EagerCafe : LazyCafe

export declare const Cafe: (new (init: ModelInit<Cafe>) => Cafe) & {
  copyOf(source: Cafe, mutator: (draft: MutableModel<Cafe>) => MutableModel<Cafe> | void): Cafe;
}

type EagerRating = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rating, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating: number;
  readonly cafeID: string;
  readonly userID: string;
  readonly itemID: string;
  readonly order: PastOrder;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ratingOrderId: string;
}

type LazyRating = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rating, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating: number;
  readonly cafeID: string;
  readonly userID: string;
  readonly itemID: string;
  readonly order: AsyncItem<PastOrder>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ratingOrderId: string;
}

export declare type Rating = LazyLoading extends LazyLoadingDisabled ? EagerRating : LazyRating

export declare const Rating: (new (init: ModelInit<Rating>) => Rating) & {
  copyOf(source: Rating, mutator: (draft: MutableModel<Rating>) => MutableModel<Rating> | void): Rating;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
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
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly phone: string;
  readonly name: string;
  readonly payment_method?: string | null;
  readonly ratings: AsyncCollection<Rating>;
  readonly past_orders: AsyncCollection<PastOrder>;
  readonly the_usual?: UsualOrder | null;
  readonly customer_id?: string | null;
  readonly device_token: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}