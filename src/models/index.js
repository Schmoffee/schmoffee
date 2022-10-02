// @ts-check
import {initSchema} from '@aws-amplify/datastore';
import {schema} from './schema';

const OptionType = {
  BEAN: 'BEAN',
  SYRUP: 'SYRUP',
  MILK: 'MILK',
};

const ItemType = {
  COFFEE: 'COFFEE',
  COLD_DRINKS: 'COLD_DRINKS',
  SNACKS: 'SNACKS',
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

const {
  Option,
  PastOrder,
  CurrentOrder,
  Item,
  Rating,
  Cafe,
  User,
  UsualOrder,
  OrderItem,
  OrderOption,
  UserInfo,
  OrderInfo,
} = initSchema(schema);

export {
  Option,
  PastOrder,
  CurrentOrder,
  Item,
  Rating,
  Cafe,
  User,
  OptionType,
  ItemType,
  OrderStatus,
  Day,
  UsualOrder,
  OrderItem,
  OrderOption,
  UserInfo,
  OrderInfo,
};
