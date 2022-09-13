// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OptionType = {
  "BEAN": "BEAN",
  "SYRUP": "SYRUP",
  "MILK": "MILK"
};

const Status = {
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED",
  "PREPARING": "PREPARING",
  "READY": "READY",
  "COLLECTED": "COLLECTED",
  "RECEIVED": "RECEIVED"
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

const { Option, PastOrder, CurrentOrder, Item, Cafe, Rating, User, OrderItem, OrderOption, OrderInfo } = initSchema(schema);

export {
  Option,
  PastOrder,
  CurrentOrder,
  Item,
  Cafe,
  Rating,
  User,
  OptionType,
  Status,
  Day,
  OrderItem,
  OrderOption,
  OrderInfo
};