// @ts-check
import {initSchema} from '@aws-amplify/datastore';
import {schema} from './schema';

const ItemType = {
  COFFEE: 'COFFEE',
  COLD_DRINKS: 'COLD_DRINKS',
  SNACKS: 'SNACKS',
};

const OptionType = {
  BEAN: 'BEAN',
  SYRUP: 'SYRUP',
  MILK: 'MILK',
};

const OrderStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COLLECTED: 'COLLECTED',
  RECEIVED: 'RECEIVED',
};

const Day = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

const {Option, PastOrder, CurrentOrder, User, Rating, Cafe, Item, OrderItem, OrderOption, OrderInfo} =
  initSchema(schema);

export {
  Option,
  PastOrder,
  CurrentOrder,
  User,
  Rating,
  Cafe,
  Item,
  ItemType,
  OptionType,
  OrderStatus,
  Day,
  OrderItem,
  OrderOption,
  OrderInfo,
};
