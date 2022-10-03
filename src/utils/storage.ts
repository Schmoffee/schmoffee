import AsyncStorage from '@react-native-async-storage/async-storage';
import {Item} from '../models';

/**
 * Load initial values in the async storage.
 */
async function initiateStorage(): Promise<void> {
  try {
    const emptyBasket = JSON.stringify([]);
    await AsyncStorage.setItem('@isFirstTime', 'false');
    await AsyncStorage.setItem('@CurrentShopId', '');
    await AsyncStorage.setItem('@CommonBasket', emptyBasket);
    await AsyncStorage.setItem('@SpecificBasket', emptyBasket);
  } catch (err) {
    console.log('Error initiating storage', err);
  }
}

/**
 * Return whether it is the first time the app is used after download.
 * @return boolean return true if it is first time, false otherwise
 */
async function getIsFirstTime(): Promise<boolean> {
  try {
    const result = await AsyncStorage.getItem('@isFirstTime');
    return result !== 'false';
  } catch (error) {
    console.log('Error getting isFirstTime', error);
    return false;
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
async function getFreeTime() {
  try {
    const jsonValue = await AsyncStorage.getItem('@FreeTime');
    return jsonValue ? jsonValue : '';
  } catch (err) {
    console.log('Error getting free time', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function setIsLocatable(isLocatable: boolean) {
  try {
    await AsyncStorage.setItem('@IsLocatable', String(isLocatable));
  } catch (err) {
    console.log('Error setting isLocatable ', err);
  }
}

/**
 * Set the time when the app can be used again.
 */
async function getIsLocatable() {
  try {
    const jsonValue = await AsyncStorage.getItem('@IsLocatable');
    return jsonValue === 'true';
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
async function getCommonBasket(): Promise<Array<Item>> {
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
async function getSpecificBasket(): Promise<Array<Item>> {
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
async function setSpecificBasket(newBasket: Array<Item>): Promise<void> {
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
  getIsLocatable,
  setIsLocatable,
};
