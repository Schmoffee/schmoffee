import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum OptionType {
  BEAN = "BEAN",
  SYRUP = "SYRUP",
  MILK = "MILK"
}

export enum Status {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PREPARING = "PREPARING",
  READY = "READY",
  COLLECTED = "COLLECTED",
  RECEIVED = "RECEIVED"
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

export declare class OrderItem {
  readonly name: string;
  readonly price: number;
  readonly options?: OrderOption[] | null;
  constructor(init: ModelInit<OrderItem>);
}

export declare class OrderOption {
  readonly name: string;
  readonly price: number;
  readonly option_type: OptionType | keyof typeof OptionType;
  constructor(init: ModelInit<OrderOption>);
}

export declare class OrderInfo {
  readonly status: Status | keyof typeof Status;
  readonly accepted_time?: string | null;
  readonly rejected_tim?: string | null;
  readonly ready_time?: string | null;
  readonly collected_time?: string | null;
  readonly received_time?: string | null;
  readonly scheduled_times?: string[] | null;
  readonly preparing_time?: string | null;
  constructor(init: ModelInit<OrderInfo>);
}

export declare class Option {
  readonly name: string;
  readonly shop: string;
  readonly option_type: OptionType | keyof typeof OptionType;
  readonly price: number;
  readonly image?: string | null;
  readonly is_common: boolean;
  constructor(init: ModelInit<Option>);
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

type CafeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RatingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class PastOrder {
  readonly id: string;
  readonly items: OrderItem[];
  readonly user: string;
  readonly shop: string;
  readonly final_status: Status | keyof typeof Status;
  readonly sent_time: string;
  readonly received_time: string;
  readonly accepted_time?: string | null;
  readonly preparing_time?: string | null;
  readonly ready_time?: string | null;
  readonly collected_time?: string | null;
  readonly scheduled_times?: string[] | null;
  readonly total: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PastOrder, PastOrderMetaData>);
  static copyOf(source: PastOrder, mutator: (draft: MutableModel<PastOrder, PastOrderMetaData>) => MutableModel<PastOrder, PastOrderMetaData> | void): PastOrder;
}

export declare class CurrentOrder {
  readonly id: string;
  readonly items?: OrderItem[] | null;
  readonly user: string;
  readonly shop: string;
  readonly sent_time: string;
  readonly initial_scheduled_time: string;
  readonly total: number;
  readonly order_info: OrderInfo;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<CurrentOrder, CurrentOrderMetaData>);
  static copyOf(source: CurrentOrder, mutator: (draft: MutableModel<CurrentOrder, CurrentOrderMetaData>) => MutableModel<CurrentOrder, CurrentOrderMetaData> | void): CurrentOrder;
}

export declare class Item {
  readonly id: string;
  readonly shop: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string | null;
  readonly options?: Option[] | null;
  readonly rating?: number | null;
  readonly is_common: boolean;
  readonly is_in_stock: boolean;
  readonly preparation_time: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Item, ItemMetaData>);
  static copyOf(source: Item, mutator: (draft: MutableModel<Item, ItemMetaData>) => MutableModel<Item, ItemMetaData> | void): Item;
}

export declare class Cafe {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly menu: string;
  readonly opening_time: string;
  readonly closing_time: string;
  readonly is_open: boolean;
  readonly opening_days?: Day[] | keyof typeof Day | null;
  readonly image?: string | null;
  readonly description: string;
  readonly digital_queue: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Cafe, CafeMetaData>);
  static copyOf(source: Cafe, mutator: (draft: MutableModel<Cafe, CafeMetaData>) => MutableModel<Cafe, CafeMetaData> | void): Cafe;
}

export declare class Rating {
  readonly id: string;
  readonly order: string;
  readonly user: string;
  readonly shop: string;
  readonly item: string;
  readonly rating: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Rating, RatingMetaData>);
  static copyOf(source: Rating, mutator: (draft: MutableModel<Rating, RatingMetaData>) => MutableModel<Rating, RatingMetaData> | void): Rating;
}

export declare class User {
  readonly id: string;
  readonly device_id: string;
  readonly phone?: string | null;
  readonly name?: string | null;
  readonly payment_method?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly is_locatable?: boolean | null;
  readonly the_usual?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}