// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

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

const OptionType = {
  "BEAN": "BEAN",
  "SYRUP": "SYRUP",
  "MILK": "MILK"
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

const { Error, Option, PastOrder, CurrentOrder, Item, Cafe, Rating, User, UsualOrder, UserInfo, OrderOption, OrderItem, OrderInfo } = initSchema(schema);

export {
  Error,
  Option,
  PastOrder,
  CurrentOrder,
  Item,
  Cafe,
  Rating,
  User,
  PlatformType,
  ItemType,
  OrderStatus,
  OptionType,
  Day,
  UsualOrder,
  UserInfo,
  OrderOption,
  OrderItem,
  OrderInfo
};