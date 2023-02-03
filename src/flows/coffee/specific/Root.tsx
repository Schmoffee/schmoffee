import React, {useCallback, useContext} from 'react';
import {OrderingContext} from '../../../contexts';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item, OrderItem} from '../../../models';
import {ShopPage} from './screens/ShopPage';
import {PreviewPage} from './screens/PreviewPage';
import ItemPage from './screens/ItemPage';
import {useDeepCompareEffect} from 'react-use';
import {OrderingActionName} from '../../../utils/types/enums';
import {Alerts} from '../../../utils/helpers/alerts';
import CafeBrowsingPage from './screens/CafeBrowsingPage';
import {Home} from '../../common/screens/Home';
import {getAllOptions, getAllRatings} from '../../../utils/queries/datastore';

const Root = () => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  const filterSpecificBasket = useCallback(
    (freshItems: Item[], basket: OrderItem[], oldItems: Item[]) => {
      const out_of_stock_items = freshItems.filter(item => !item.is_in_stock).map(item => item.id);
      const out_of_stock_options = freshItems
        .filter(item => !item.is_in_stock)
        .map(item => item.options?.map(option => option?.id))
        .flat();
      let new_basket: OrderItem[] = basket;
      let removed_items: string[] = [];
      let removed_options: {item: string; option: string}[] = [];
      oldItems.forEach(item => {
        if (out_of_stock_items.includes(item.id) && item.is_in_stock) {
          new_basket = new_basket.filter(basket_item => {
            if (basket_item.id === item.id) {
              removed_items.push(basket_item.name);
              return false;
            }
            return true;
          });
        } else if (!out_of_stock_items.includes(item.id) && item.is_in_stock) {
          item.options?.forEach(option => {
            if (out_of_stock_options.includes(option?.id) && option?.is_in_stock) {
              new_basket.map(basket_item => {
                if (basket_item.id === item.id) {
                  removed_options.push({item: basket_item.name, option: option?.name});
                  return {
                    ...basket_item,
                    options: basket_item.options?.filter(basket_option => basket_option?.name !== option?.name),
                  };
                }
                return basket_item;
              });
            }
          });
        }
      });
      const changes = removed_options.length + removed_items.length;
      if (changes) {
        ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: new_basket});
        Alerts.outOfStockAlert(removed_items, removed_options);
      }
    },
    [ordering_dispatch],
  );

  /**
   * Get all the specific items from the database and subscribe to any changes to them. Update the specific basket accordingly.
   */
  useDeepCompareEffect(() => {
    if (ordering_state.current_shop_id) {
      const subscription = DataStore.observeQuery(
        Item,
        //@ts-ignore
        item => item.cafeID('eq', ordering_state.current_shop_id),
        {
          sort: item => item.type(SortDirection.ASCENDING),
        },
      ).subscribe(async snapshot => {
        const {items, isSynced} = snapshot;
        let full_items: Item[] = [];
        if (isSynced) {
          const all_options = await getAllOptions();
          const all_ratings = await getAllRatings();
          const basket = ordering_state.specific_basket;
          const old_items = ordering_state.specific_items;
          full_items = items.map(item => {
            const options = all_options.filter(option => option.itemID === item.id);
            const ratings = all_ratings.filter(rating => rating.itemID === item.id);
            return {...item, options: options, ratings: ratings};
          });
          filterSpecificBasket(full_items, basket, old_items);
        }
        ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_ITEMS, payload: full_items});
      });
      return () => subscription.unsubscribe();
    }
  }, [
    filterSpecificBasket,
    ordering_dispatch,
    ordering_state.current_shop_id,
    ordering_state.specific_basket,
    ordering_state.specific_items,
  ]);

  return (
    <CoffeeStack.Navigator
      initialRouteName="PreviewPage"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <CoffeeStack.Group>
        <CoffeeStack.Screen name="Home" component={Home} />
        <CoffeeStack.Screen name="Cafes" component={CafeBrowsingPage} />
        <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
        <CoffeeStack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
          <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
          <CoffeeStack.Screen name="PreviewPage" component={PreviewPage} />
        </CoffeeStack.Group>
      </CoffeeStack.Group>
    </CoffeeStack.Navigator>
  );
};

export default Root;
