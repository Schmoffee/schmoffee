import React, {useCallback, useContext} from 'react';
import {OrderingContext} from '../../../contexts';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item, OrderItem} from '../../../models';
import {ShopPage} from './screens/ShopPage';
import {PreviewPage} from './screens/PreviewPage';
import ItemPage from '../../common/screens/ItemPage';
import {useDeepCompareEffect} from 'react-use';
import {OrderingActionName} from '../../../utils/types/enums';
import {Alerts} from '../../../utils/helpers/alerts';
import CafeBrowsingPage from './screens/CafeBrowsingPage';
import {Home} from './screens/Home';

const Root = () => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  const filterSpecificBasket = useCallback(
    (newItems: Item[], basket: OrderItem[], oldItems: Item[]) => {
      const item_names: string[] = newItems.map(item => item.name);
      const removed_items: string[] = oldItems.filter(item => !item_names.includes(item.name)).map(item => item.name);
      if (removed_items.length > 0 && basket.length > 0) {
        const new_spec_basket = basket.filter(item => !removed_items.includes(item.name));
        const changes = basket.length - new_spec_basket.length;
        if (changes > 0) {
          ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: new_spec_basket});
          Alerts.outOfStockAlert(removed_items);
        }
      }
    },
    [ordering_dispatch],
  );

  /**
   * Get all the specific items from the database and subscribe to any changes to them. Update the specific basket accordingly.
   */
  useDeepCompareEffect(() => {
    if (ordering_state.current_shop_id) {
      console.log(ordering_state.current_shop_id);
      const subscription = DataStore.observeQuery(
        Item,
        //@ts-ignore
        item => item.cafeID('eq', ordering_state.current_shop_id),
        {
          sort: item => item.type(SortDirection.ASCENDING),
        },
      ).subscribe(snapshot => {
        const {items, isSynced} = snapshot;
        console.log('Items: ', items);
        if (isSynced) {
          const basket = ordering_state.specific_basket;
          const old_items = ordering_state.specific_items;
          filterSpecificBasket(items, basket, old_items);
        }
        ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_ITEMS, payload: items});
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
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <CoffeeStack.Group>
        <CoffeeStack.Screen name="Home" component={Home} />
        <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
        <CoffeeStack.Screen name="Cafes" component={CafeBrowsingPage} />
        <CoffeeStack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
          <CoffeeStack.Screen name="PreviewPage" component={PreviewPage} />
          <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
        </CoffeeStack.Group>
      </CoffeeStack.Group>
    </CoffeeStack.Navigator>
  );
};

export default Root;
