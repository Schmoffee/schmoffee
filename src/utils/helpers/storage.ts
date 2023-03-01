import AsyncStorage from '@react-native-async-storage/async-storage';
import {Item, OrderItem} from '../../models';
import {CommonBasketItem} from '../types/data.types';

/**
 * Load initial values in the async storage.
 */
async function initiateStorage(): Promise<void> {
  try {
    const emptyBasket = JSON.stringify([]);
    await AsyncStorage.setItem('@CurrentShopId', '');
    await AsyncStorage.setItem('@CommonBasket', emptyBasket);
    await AsyncStorage.setItem('@SpecificBasket', emptyBasket);
    await AsyncStorage.setItem('@FreeTime', '0');
    await AsyncStorage.setItem('@Trials', '0');
    await AsyncStorage.setItem('@Phone', '');
    await AsyncStorage.setItem('@DeletedOrders', emptyBasket);
  } catch (err) {
    console.log('Error initiating storage', err);
  }
}

/**
 * Return whether it is the first time the app is used after download.
 * @return boolean return true if it is first time, false otherwise
 */
async function getIsFirstTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@isFirstTime');
  } catch (error) {
    console.log('Error getting isFirstTime', error);
    return null;
  }
}

async function setFirstTime(): Promise<void> {
  try {
    await AsyncStorage.setItem('@isFirstTime', 'false');
  } catch (error) {
    console.log('Error setting isFirstTime', error);
  }
}

async function getNotificationsAsked(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem('@AskedNotifications');
    return value === 'true';
  } catch (error) {
    console.log('Error getting isFirstTime', error);
    return false;
  }
}

async function setNotificationsAsked(): Promise<void> {
  try {
    await AsyncStorage.setItem('@AskedNotifications', 'true');
  } catch (error) {
    console.log('Error setting isFirstTime', error);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function setFreeTime(time: number) {
  try {
    await AsyncStorage.setItem('@FreeTime', String(time));
  } catch (err) {
    console.log('Error setting free time', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function getFreeTime(): Promise<string | void> {
  try {
    return (await AsyncStorage.getItem('@FreeTime')) as string;
  } catch (err) {
    console.log('Error getting free time', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function setTrials(trials: number) {
  try {
    await AsyncStorage.setItem('@Trials', String(trials));
  } catch (err) {
    console.log('Error setting isLocatable ', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function getTrials(): Promise<string | void> {
  try {
    return (await AsyncStorage.getItem('@Trials')) as string;
  } catch (err) {
    console.log('Error getting isLocatable', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function setDeletedOrders(deletedIds: string[]) {
  try {
    await AsyncStorage.setItem('@DeletedOrders', JSON.stringify(deletedIds));
  } catch (err) {
    console.log('Error setting  Deleted Orders', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function getDeletedOrders(): Promise<string[] | void> {
  try {
    const jsonValue = await AsyncStorage.getItem('@DeletedOrders');
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (err) {
    console.log('Error getting isLocatable', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function setPhone(phone: string) {
  try {
    await AsyncStorage.setItem('@Phone', phone);
  } catch (err) {
    console.log('Error setting isLocatable ', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function getPhone(): Promise<string | void> {
  try {
    return (await AsyncStorage.getItem('@Phone')) as string;
  } catch (err) {
    console.log('Error getting isLocatable', err);
  }
}

/**
 * Returns the storage shop key
 * @return Number The key of the shop
 */
async function getCurrentShopId(): Promise<string> {
  try {
    const jsonValue = await AsyncStorage.getItem('@CurrentShopId');
    return jsonValue ? jsonValue : '';
  } catch (err) {
    console.log('Error getting current shop id', err);
    return '';
  }
}

/**
 * Set the storage shop key to the given one
 * @param shopId
 */
async function setCurrentShopId(shopId: string): Promise<void> {
  try {
    await AsyncStorage.setItem('@CurrentShopId', shopId);
  } catch (err) {
    console.log('Error setting current shop id', err);
  }
}

/**
 * Retrieve the basket from the storage.
 * @return Array if the basket exists, return it, otherwise return empty array
 */
async function getCommonBasket(): Promise<Array<CommonBasketItem>> {
  try {
    const jsonValue = await AsyncStorage.getItem('@CommonBasket');
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (err) {
    console.log('Error getting common basket', err);
    return [];
  }
}

/**
 * Set the storage basket to the given new basket.
 * @param newBasket The new basket
 */
async function setCommonBasket(newBasket: Array<Item>): Promise<void> {
  try {
    const jsonValue = JSON.stringify(newBasket);
    await AsyncStorage.setItem('@CommonBasket', jsonValue);
  } catch (err) {
    console.log('Error setting common basket', err);
  }
}

/**
 * Clear the storage basket, i.e., set it to an empty array.
 */
async function clearStorageCommonBasket() {
  await setCommonBasket([]);
}

/**
 * Retrieve the basket from the storage.
 * @return Array if the basket exists, return it, otherwise return empty array
 */
async function getSpecificBasket(): Promise<Array<OrderItem>> {
  try {
    const jsonValue = await AsyncStorage.getItem('@SpecificBasket');
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (err) {
    console.log('Error getting specific basket', err);
    return [];
  }
}

/**
 * Set the storage basket to the given new basket.
 * @param newBasket The new basket
 */
async function setSpecificBasket(newBasket: Array<OrderItem>): Promise<void> {
  try {
    const jsonValue = JSON.stringify(newBasket);
    await AsyncStorage.setItem('@SpecificBasket', jsonValue);
  } catch (err) {
    console.log('Error setting specific basket', err);
  }
}

/**
 * Clear the storage basket, i.e., set it to an empty array.
 */
async function clearStorageSpecificBasket() {
  await setSpecificBasket([]);
}

/**
 * Retrieve the basket from the storage.
 * @return Array if the basket exists, return it, otherwise return empty array
 */
async function getClientSecret(): Promise<string | null> {
  try {
    const jsonValue = await AsyncStorage.getItem('@ClientSecret');
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log('Error getting client secret', err);
    return null;
  }
}

/**
 * Set the storage basket to the given new basket.
 * @param secret
 */
async function setClientSecret(secret: string): Promise<void> {
  try {
    const jsonValue = JSON.stringify(secret);
    await AsyncStorage.setItem('@ClientSecret', jsonValue);
  } catch (err) {
    console.log('Error setting client secret', err);
  }
}

export {
  initiateStorage,
  getIsFirstTime,
  clearStorageSpecificBasket,
  setSpecificBasket,
  getSpecificBasket,
  clearStorageCommonBasket,
  setCommonBasket,
  getCommonBasket,
  setCurrentShopId,
  getCurrentShopId,
  setFreeTime,
  getFreeTime,
  getTrials,
  setTrials,
  setPhone,
  getPhone,
  setClientSecret,
  getClientSecret,
  getDeletedOrders,
  setDeletedOrders,
  setFirstTime,
  getNotificationsAsked,
  setNotificationsAsked,
};
