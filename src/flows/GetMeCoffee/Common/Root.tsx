import React, {useContext, useEffect, useReducer} from 'react';
import {GlobalContext, orderingData, OrderingContext} from '../../../contexts';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item, OrderItem} from '../../../models';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {Home} from './screens/Home';
import {PreviewPage} from '../Specific/screens/PreviewPage';
import {WhatPage} from './screens/WhatPage';
import {WhenPage} from './screens/WhenPage';
import {orderingReducer} from '../../../reducers';
import ItemPage from '../../CommonScreens/ItemPage';
import {ShopPage} from '../Specific/screens/ShopPage';
import {CommonBasketItem} from '../../../utils/types/data.types';

/**
 * Top/Root level component of the "Get me Coffee" flow.
 * Where subscriptions and queries that need to be available to all screens in the flow are maintained.
 * @constructor
 */
const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [ordering_state, ordering_dispatch] = useReducer(orderingReducer, orderingData);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  /**
   * Get all the common items from the database and subscribe to any changes to them. Update the common and specific basket accordingly.
   */
  useEffect(() => {
    const subscription = DataStore.observeQuery(Item, item => item.is_common('eq', true).is_in_stock('eq', true), {
      sort: item => item.type(SortDirection.ASCENDING),
    }).subscribe(snapshot => {
      const {items, isSynced} = snapshot;
      ordering_dispatch({type: 'SET_COMMON_ITEMS', payload: items});
      if (isSynced) {
        const item_names: string[] = items.map(item => item.name);
        const removed_items: string[] = ordering_state.common_items
          .filter(item => !item_names.includes(item.name))
          .map(item => item.name);
        const common_basket: CommonBasketItem[] = ordering_state.common_basket;
        if (removed_items.length > 0 && common_basket.length > 0) {
          const new_common_basket = common_basket.filter(item => !removed_items.includes(item.name));
          const changes = common_basket.length - new_common_basket.length;
          if (changes > 0) {
            ordering_dispatch({type: 'SET_COMMON_BASKET', payload: new_common_basket});
            // TODO: Alert the user that certain items have been removed from their basket.
          }
        }
        console.log('Synced');
      }
    });
    return () => subscription.unsubscribe();
  }, [ordering_dispatch]);

  return (
    <OrderingContext.Provider value={{ordering_state, ordering_dispatch}}>
      <CoffeeStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'none',
        }}>
        <CoffeeStack.Screen name="Home" component={Home} />
        <CoffeeStack.Screen name="WhatPage" component={WhatPage} />
        <CoffeeStack.Screen name="WhenPage" component={WhenPage} />
        <CoffeeStack.Screen name="PreviewPage" component={PreviewPage} />
        <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
        <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
      </CoffeeStack.Navigator>
    </OrderingContext.Provider>
  );
};

export default Root;
