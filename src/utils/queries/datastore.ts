import {
  Cafe,
  CurrentOrder,
  Item,
  OrderInfo,
  OrderItem,
  User,
} from '../../models';
import {DataStore} from 'aws-amplify';

async function getCommonItems(): Promise<Item[] | null> {
  try {
    return await DataStore.query(Item);
  } catch (error) {
    console.log('Error retrieving items', error);
    return null;
  }
}

async function createSignUpUser(
  phone: string,
  name: string,
  is_locatable: boolean,
  payment_method: string,
): Promise<User> {
  return await DataStore.save(
    new User({
      phone: phone,
      name: name,
      is_locatable: is_locatable,
      payment_method: payment_method,
      is_signed_in: false,
    }),
  );
}

async function getUserByPhoneNumber(
  phone_number: string,
): Promise<User | null> {
  const result = await DataStore.query(User, c => c.phone('eq', phone_number));
  return result[0];
}

async function getUserById(id: string): Promise<User | null> {
  const result = await DataStore.query(User, c => c.id('eq', id));
  return result[0];
}

async function updateAuthState(id: string, is_signed_in: boolean) {
  const user = await getUserById(id);
  if (user) {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.is_signed_in = is_signed_in;
      }),
    );
  }
}

async function sendOrder(
  items: OrderItem[],
  total: number,
  order_info: OrderInfo,
  cafe: Cafe,
  user: User,
): Promise<string> {
  const order: CurrentOrder = await DataStore.save(
    new CurrentOrder({
      items: items,
      total: total,
      order_info: order_info,
      user: user,
      cafe: cafe,
    }),
  );
  return order.id;
}

async function getBestShop(): Promise<Cafe | null> {
  const result = await DataStore.query(Cafe);
  return result[0];
}

export {
  getCommonItems,
  getUserByPhoneNumber,
  updateAuthState,
  createSignUpUser,
  getUserById,
  sendOrder,
  getBestShop,
};
