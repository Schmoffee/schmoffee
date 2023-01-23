import {OrderItem, OrderOption} from '../../models';

function findSameItemIndex(basket: OrderItem[], item: OrderItem) {
  return basket.findIndex((basketItem: OrderItem) => {
    const same_name = basketItem.name === item.name;
    const has_options = basketItem.options && basketItem.options.length > 0;
    if (same_name) {
      const a = has_options ? basketItem.options.map((option: OrderOption) => option.name) : [];
      const b = item.options && item.options.length > 0 ? item.options.map((option: OrderOption) => option.name) : [];
      return equalsCheck(a, b);
    }
    return false;
  });
}

const equalsCheck = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v: string, i: number) => v === b[i]);

/**
 * Calculate and return the total price of the options of an item
 * @param item The target item
 * @return Number The total price for the item's options
 */
function getOptionsPrice(item: OrderItem) {
  return item.options
    ? item.options.reduce(function (acc, option) {
        return acc + option.price;
      }, 0)
    : 0;
}

export {findSameItemIndex, equalsCheck, getOptionsPrice};
