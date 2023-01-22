// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OptionType = {
  "BEAN": "BEAN",
  "SYRUP": "SYRUP",
  "MILK": "MILK"
};

const PlatformType = {
  "IOS": "IOS",
  "ANDROID": "ANDROID"
};

const ItemType = {
  "COFFEE": "COFFEE",
  "COLD_DRINKS": "COLD_DRINKS",
  "SNACKS": "SNACKS"
};

const OrderStatus = {
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED",
  "PREPARING": "PREPARING",
  "READY": "READY",
  "COLLECTED": "COLLECTED",
  "RECEIVED": "RECEIVED",
  "SENT": "SENT"
};

const Day = {
  "MONDAY": "MONDAY",
  "TUESDAY": "TUESDAY",
  "WEDNESDAY": "WEDNESDAY",
  "THURSDAY": "THURSDAY",
  "FRIDAY": "FRIDAY",
  "SATURDAY": "SATURDAY",
  "SUNDAY": "SUNDAY"
};

const { Error, Option, PastOrder, CurrentOrder, Item, Rating, Cafe, User, UsualOrder, OrderItem, OrderOption, UserInfo, OrderInfo } = initSchema(schema);

export {
  Error,
  Option,
  PastOrder,
  CurrentOrder,
  Item,
  Rating,
  Cafe,
  User,
  OptionType,
  PlatformType,
  ItemType,
  OrderStatus,
  Day,
  UsualOrder,
  OrderItem,
  OrderOption,
  UserInfo,
  OrderInfo
};