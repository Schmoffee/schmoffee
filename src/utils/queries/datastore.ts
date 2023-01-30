import {
  Cafe,
  CurrentOrder,
  Error,
  Item,
  Option,
  OrderInfo,
  OrderItem,
  OrderStatus,
  PastOrder,
  Rating,
  User,
  UserInfo,
  UsualOrder,
} from '../../models';
import {DataStore} from 'aws-amplify';
import {DigitalQueue, LocalUser, Location, PreferenceWeights, PreRating} from '../types/data.types';
import {getDistance} from 'geolib';

async function getCommonItems(): Promise<Item[] | null> {
  try {
    return await DataStore.query(Item);
  } catch (error) {
    console.log('Error retrieving items', error);
    return null;
  }
}

async function createSignUpUser(phone: string, name: string, device_token: string): Promise<User> {
  return await DataStore.save(
    new User({
      phone: phone,
      name: name,
      device_token: device_token,
    }),
  );
}

async function getUserByPhoneNumber(phone_number: string): Promise<User | null> {
  try {
    const result = await DataStore.query(User, c => c.phone('eq', phone_number));
    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getUserById(id: string): Promise<User | null> {
  const result = await DataStore.query(User, c => c.id('eq', id));
  return result[0];
}

async function getCafeById(id: string): Promise<Cafe | null> {
  const result = await DataStore.query(Cafe, c => c.id('eq', id));
  return result[0];
}
async function updatePaymentMethod(id: string, payment_method: string) {
  const user = await getUserById(id);
  if (user) {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.payment_method = payment_method;
      }),
    );
  }
}

async function updateDeviceToken(id: string, token: string) {
  const user = await getUserById(id);
  if (user) {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.device_token = token;
      }),
    );
  }
}

async function newSignIn(id: string) {
  const user = await getUserById(id);
  if (user) {
    const new_user = await DataStore.save(
      User.copyOf(user, updated => {
        updated.device_token = '';
      }),
    );
    console.log('updated user', new_user);
  }
}

async function sendOrder(
  items: OrderItem[],
  total: number,
  order_info: OrderInfo,
  cafeID: string,
  userID: string,
  user_info: UserInfo,
  payment_id: string,
): Promise<string> {
  const order: CurrentOrder = await DataStore.save(
    new CurrentOrder({
      items: items,
      total: total,
      order_info: order_info,
      cafeID: cafeID,
      userID: userID,
      user_info: user_info,
      status: OrderStatus.SENT,
      payment_id: payment_id,
      display: true,
    }),
  );
  return order.id;
}

async function deleteOrder(order_id: string): Promise<CurrentOrder | null> {
  const deleted_orders: CurrentOrder[] = await DataStore.delete(CurrentOrder, order => order.id('eq', order_id));
  return deleted_orders[0] ? deleted_orders[0] : null;
}

async function terminateOrder(order_id: string, ratings: PreRating[], usual: boolean) {
  const terminated_order = await deleteOrder(order_id);
  if (terminated_order) {
    const past_order = await DataStore.save(
      new PastOrder({
        items: terminated_order.items,
        userID: terminated_order.userID,
        order_info: terminated_order.order_info,
        cafeID: terminated_order.cafeID,
        final_status: terminated_order.status,
        total: terminated_order.total,
        payment_id: terminated_order.payment_id,
      }),
    );

    for (const rating of ratings) {
      await DataStore.save(
        new Rating({
          itemID: rating.itemID,
          rating: rating.rating,
          userID: past_order.userID,
          cafeID: past_order.cafeID,
          ratingOrderId: past_order.id,
          order: past_order,
        }),
      );
    }

    if (!usual) {
      const scheduled_time = new Date(terminated_order.order_info.scheduled_times[0]).getMinutes();
      const sent_time = new Date(terminated_order.order_info.sent_time).getMinutes();
      const schedule = Math.abs(scheduled_time - sent_time);
      const usual_order: UsualOrder = {
        items: terminated_order.items,
        schedule: schedule,
        cafeID: terminated_order.cafeID,
      };
      await setUsualOrder(usual_order, terminated_order.userID);
    }
  }
}

async function setUsualOrder(usual_order: UsualOrder, userID: string) {
  const user = await getUserById(userID);
  if (user) {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.the_usual = usual_order;
      }),
    );
  }
}

async function getUserRatings(userID: string): Promise<Rating[] | null> {
  const results = await DataStore.query(User, c => c.id('eq', userID));
  if (results) return results[0].ratings as Rating[];
  else return null;
}

async function getUserPastOrders(userID: string): Promise<PastOrder[] | null> {
  return await DataStore.query(PastOrder, c => c.userID('eq', userID));
}

async function updateCustomerId(customerId: string, userID: string) {
  const user = await getUserById(userID);
  if (user) {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.customer_id = customerId;
      }),
    );
  }
}

/**
 * Returns the cafe with the best score based on the user's preferences.
 * @param user
 * @param items
 * @param schedule_time
 * @param target
 */
async function getBestShop(
  user: LocalUser,
  items: OrderItem[],
  schedule_time: number,
  target: Location,
): Promise<string | null> {
  // TODO: Only get the shops that are in the vicinity (5 minute walk)
  const cafes = await DataStore.query(Cafe);
  const weights: PreferenceWeights = {distance: -1, personal_taste: 1.5, general_taste: 1, price: -1.5, queue: -2};
  let best_shop: Cafe | null = null;
  let best_score = -1;
  for (const cafe of cafes) {
    const score = await getScore(user, items, schedule_time, target, weights, cafe);
    if (score && score > best_score) {
      best_score = score;
      best_shop = cafe;
    }
  }
  return best_shop ? best_shop.id : null;
}

async function getShops(id_filter: string | null = null): Promise<Cafe[] | null> {
  return await DataStore.query(Cafe, c => (id_filter ? c.id('eq', id_filter) : c));
}

/**
 *  Factors: distance, personal ratings, general ratings, digital queue and price
 * @param user
 * @param items
 * @param schedule_time
 * @param target
 * @param weights
 * @param cafe
 */
async function getScore(
  user: LocalUser,
  items: OrderItem[],
  schedule_time: number,
  target: Location,
  weights: PreferenceWeights,
  cafe: Cafe,
): Promise<number | null> {
  let distance_score = weights.distance * getDistance(target, {latitude: cafe.latitude, longitude: cafe.longitude});
  let personal_taste_score = 0;
  let general_taste_score = 0;
  let queue_score = 0;
  let price_score = 0;
  if (cafe.menu) {
    const item_names = items.map(item => item.name);
    const concerned_cafe_items = cafe.menu.filter(item => item_names.includes(item.name));
    const formatted_cafe = {
      id: cafe.id,
      menu: concerned_cafe_items.map(item => item.id),
      sum_ratings: 0,
      num_ratings: 0,
    };
    const personal_ratings: Rating[] | null = await getUserRatings(user.id);
    if (personal_ratings) {
      personal_ratings.forEach(rating => {
        if (formatted_cafe.menu?.includes(rating.itemID)) {
          formatted_cafe.sum_ratings += rating.rating;
          formatted_cafe.num_ratings += 1;
        }
      });

      if (formatted_cafe.num_ratings > 0) {
        personal_taste_score = weights.personal_taste * (formatted_cafe.sum_ratings / formatted_cafe.num_ratings);
      }
    }
    if (cafe.ratings) {
      cafe.ratings.forEach(rating => {
        if (rating && formatted_cafe.menu?.includes(rating.itemID)) {
          formatted_cafe.sum_ratings += rating.rating;
          formatted_cafe.num_ratings += 1;
        }
      });
      if (formatted_cafe.num_ratings > 0) {
        general_taste_score = weights.general_taste * (formatted_cafe.sum_ratings / formatted_cafe.num_ratings);
      }
    }
    const now = new Date(Date.now());
    const target_minute = now.getHours() * 60 + now.getMinutes() + schedule_time;
    const total_preparation_time = concerned_cafe_items.reduce((acc, item) => acc + item.preparation_time, 0);
    const preparation_range = [target_minute - total_preparation_time, target_minute];

    const digital_queue: DigitalQueue = JSON.parse(cafe.digital_queue);
    let worst_case = 0;
    for (let current_minute = preparation_range[0]; current_minute <= preparation_range[1]; current_minute++) {
      if (digital_queue[current_minute].length > worst_case) {
        worst_case = digital_queue[current_minute].length;
      }
    }
    queue_score = weights.queue * worst_case;

    const price = concerned_cafe_items.reduce((acc, item) => acc + item.price, 0);
    price_score = weights.price * price;

    return distance_score + personal_taste_score + general_taste_score + queue_score + price_score;
  } else {
    return null;
  }
}

async function checkMultiSignIn(number: string, token: string): Promise<string | null> {
  const existingUser = await getUserByPhoneNumber(number);
  if (existingUser && existingUser.device_token !== token) {
    return existingUser.id;
  }
  return null;
}

async function registerError(phone: string, description: string, type: string) {
  const time = new Date(Date.now()).toISOString();
  await DataStore.save(
    new Error({
      user_phone: phone,
      type: type,
      description: description,
      time: time,
    }),
  );
}

async function getCurrOrder(userID: string): Promise<CurrentOrder | null> {
  const order = await DataStore.query(CurrentOrder, current_order => current_order.userID('eq', userID));
  return order[0] ? order[0] : null;
}

async function getAllOptions(): Promise<Option[]> {
  return await DataStore.query(Option);
}

async function getAllRatings(): Promise<Rating[]> {
  return await DataStore.query(Rating);
}

export {
  getCommonItems,
  getUserByPhoneNumber,
  createSignUpUser,
  getUserById,
  sendOrder,
  getBestShop,
  terminateOrder,
  updatePaymentMethod,
  getUserPastOrders,
  updateCustomerId,
  deleteOrder,
  getShops,
  checkMultiSignIn,
  newSignIn,
  updateDeviceToken,
  registerError,
  getCurrOrder,
  getAllOptions,
  getAllRatings,
  getCafeById,
  setUsualOrder,
};
