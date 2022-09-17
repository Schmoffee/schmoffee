import {Item, User} from '../../models';
import {DataStore} from 'aws-amplify';

async function getCommonItems(): Promise<Item[] | null> {
  try {
    return await DataStore.query(Item);
  } catch (error) {
    console.log('Error retrieving items', error);
    return null;
  }
}

async function updateUserSignUp(
  anonymousUser: User,
  name: string,
  phone_number: string,
  is_locatable: boolean,
  payment_method: string,
): Promise<User | null> {
  let user: User;
  const original = await DataStore.query(User, anonymousUser.id);
  if (original) {
    user = await DataStore.save(
      User.copyOf(original, updated => {
        updated.name = name;
        updated.phone = phone_number;
      }),
    );
  } else {
    user = await DataStore.save(
      new User({
        device_id: anonymousUser.device_id,
        name: name,
        phone: phone_number,
        is_locatable: is_locatable,
        payment_method: payment_method,
      }),
    );
  }
  return user;
}

async function createAnonymousUser(device_id: string): Promise<User | null> {
  return await DataStore.save(
    new User({
      device_id: device_id,
      is_locatable: false,
    }),
  );
}

async function getUserByDeviceId(device_id: string): Promise<User | null> {
  const result = await DataStore.query(User, c => c.device_id('eq', device_id));
  return result[0];
}

export {
  getCommonItems,
  getUserByDeviceId,
  updateUserSignUp,
  createAnonymousUser,
};
