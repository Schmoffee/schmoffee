import React, { useContext } from 'react';
import { OrderingContext } from '../../../contexts';
import { DataStore, SortDirection } from 'aws-amplify';
import { Item } from '../../../models';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CoffeeRoutes } from '../../../utils/types/navigation.types';
import { Home } from './screens/Home';
import { WhenPage } from './screens/WhenPage';
import { ShopPage } from '../specific/screens/ShopPage';
import { useDeepCompareEffect } from 'react-use';
import ItemPage from '../../common/screens/ItemPage';

/**
 * Top/Root level component of the "Get me Coffee" flow.
 * Where subscriptions and queries that need to be available to all screens in the flow are maintained.
 * @constructor
 */
const Root = () => {
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  /**
   * Get all the common items from the database and subscribe to any changes to them. Update the common and specific basket accordingly.
   */
  useDeepCompareEffect(() => {
    const subscription = DataStore.observeQuery(Item, item => item.is_common('eq', true).is_in_stock('eq', true), {
      sort: item => item.type(SortDirection.ASCENDING),
    }).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      if (isSynced) {
        const commonBasket = ordering_state.common_basket;
        const item_names: string[] = items.map(item => item.name);
        const removed_items: string[] = ordering_state.common_items
          .filter(item => !item_names.includes(item.name))
          .map(item => item.name);
        if (removed_items.length > 0 && commonBasket.length > 0) {
          const new_common_basket = commonBasket.filter(item => !removed_items.includes(item.name));
          const changes = commonBasket.length - new_common_basket.length;
          if (changes > 0) {
            ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: new_common_basket });
            // TODO: Alert the user that certain items have been removed from their basket.
          }
        }
        console.log('Synced');
      }
      ordering_dispatch({ type: 'SET_COMMON_ITEMS', payload: items });
    });
    return () => subscription.unsubscribe();
  }, [ordering_dispatch, ordering_state.common_basket, ordering_state.common_items]);

  return (
    <CoffeeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'none',
      }}>
      <CoffeeStack.Screen name="Home" component={Home} />
      <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
      <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
      <CoffeeStack.Screen name="WhenPage" component={WhenPage} />
    </CoffeeStack.Navigator>
  );
};

export default Root;
