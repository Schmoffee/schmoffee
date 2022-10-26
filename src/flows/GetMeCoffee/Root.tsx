import React, { useContext, useEffect, useReducer } from 'react';
import { GlobalContext, orderingData, OrderingContext } from '../../contexts';
import { DataStore, SortDirection } from 'aws-amplify';
import { Item } from '../../models';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CoffeeRoutes } from '../../utils/types/navigation.types';
import { Home } from './screens/Home';
import { PreviewPage } from './screens/PreviewPage';
import { WhatPage } from './screens/WhatPage';
import { WhenPage } from './screens/WhenPage';
import { orderingReducer } from '../../reducers';
import ItemPage from './screens/ItemPage';
import { ShopPage } from './screens/ShopPage';

/**
 * Top/Root level component of the "Get me Coffee" flow.
 * Where subscriptions and queries that need to be available to all screens in the flow are maintained.
 * @constructor
 */
const Root = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const [ordering_state, ordering_dispatch] = useReducer(orderingReducer, orderingData);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  /**
   * Get all the common items from the database and subscribe to any changes to them.
   */
  useEffect(() => {
    const subscription = DataStore.observeQuery(Item, item => item.is_common('eq', true), {
      sort: item => item.type(SortDirection.ASCENDING),
    }).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      ordering_dispatch({ type: 'SET_COMMON_ITEMS', payload: items });
      if (isSynced) {
        console.log('Synced');
      }
      console.log('items: synced? ', isSynced, ' list: ', JSON.stringify(items, null, 2));
    });
    return () => subscription.unsubscribe();
  }, [ordering_dispatch]);

  return (
    <OrderingContext.Provider value={{ ordering_state, ordering_dispatch }}>
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
        <CoffeeStack.Group screenOptions={{ presentation: 'modal' }}>
          <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
        </CoffeeStack.Group>
        <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
      </CoffeeStack.Navigator>
    </OrderingContext.Provider>
  );
};

export default Root;
