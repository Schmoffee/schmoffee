import React, {useCallback, useContext, useEffect} from 'react';
import {OrderingContext} from '../../../contexts';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item, OrderItem} from '../../../models';
import {ShopPage} from './screens/ShopPage';
import {PreviewPage} from './screens/PreviewPage';
import {ChangeShop} from './screens/ChangeShop';
import ItemPage from '../../CommonScreens/ItemPage';
import {Home} from '../Common/screens/Home';
import {WhenPage} from '../Common/screens/WhenPage';

const Root = () => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  const filterSpecificBasket = useCallback(
    (items: Item[]) => {
      const item_names: string[] = items.map(item => item.name);
      const removed_items: string[] = ordering_state.specific_items
        .filter(item => !item_names.includes(item.name))
        .map(item => item.name);
      const spec_basket: OrderItem[] = ordering_state.specific_basket;
      if (removed_items.length > 0 && spec_basket.length > 0) {
        const new_spec_basket = spec_basket.filter(item => !removed_items.includes(item.name));
        const changes = spec_basket.length - new_spec_basket.length;
        if (changes > 0) {
          ordering_dispatch({type: 'SET_SPECIFIC_BASKET', payload: new_spec_basket});
          // TODO: Alert the user that certain items have been removed from their basket.
        }
      }
    },
    [ordering_dispatch, ordering_state.specific_basket, ordering_state.specific_items],
  );

  /**
   * Get all the specific items from the database and subscribe to any changes to them. Update the common and specific basket accordingly.
   */
  useEffect(() => {
    if (ordering_state.current_shop_id) {
      const subscription = DataStore.observeQuery(
        Item,
        //@ts-ignore
        item => item.cafeID('eq', ordering_state.current_shop_id).is_in_stock('eq', true),
        {
          sort: item => item.type(SortDirection.ASCENDING),
        },
      ).subscribe(snapshot => {
        const {items, isSynced} = snapshot;
        ordering_dispatch({type: 'SET_SPECIFIC_ITEMS', payload: items});
        if (isSynced) {
          filterSpecificBasket(items);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [filterSpecificBasket, ordering_dispatch, ordering_state.current_shop_id]);

  return (
    <CoffeeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <CoffeeStack.Group>
        <CoffeeStack.Screen name="Home" component={Home} />
        <CoffeeStack.Screen name="ItemPage" component={ItemPage} />
        <CoffeeStack.Screen name="ShopPage" component={ShopPage} />
        <CoffeeStack.Screen name="WhenPage" component={WhenPage} />
        <CoffeeStack.Screen name="PreviewPage" component={PreviewPage} />
      </CoffeeStack.Group>
      <CoffeeStack.Group screenOptions={{presentation: 'modal'}}>
        <CoffeeStack.Screen name="ChangeShopPage" component={ChangeShop} />
      </CoffeeStack.Group>
    </CoffeeStack.Navigator>
  );
};

export default Root;
