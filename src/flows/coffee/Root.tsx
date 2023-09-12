import React, {useEffect, useReducer} from 'react';
import {orderingData, OrderingContext} from '../../contexts';
import {orderingReducer} from '../../reducers';
import SpecificRoot from './specific/Root';
import {getCurrentShopId, getSpecificBasket} from '../../utils/helpers/storage';
import {Cafe, OrderItem} from '../../models';
import {OrderingActionName} from '../../utils/types/enums';
import {DataStore, SortDirection} from 'aws-amplify';

const Root = () => {
  const [ordering_state, ordering_dispatch] = useReducer(orderingReducer, orderingData);

  useEffect(() => {
    async function refreshBaskets() {
      const specific_basket: OrderItem[] = await getSpecificBasket();
      ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: specific_basket});
    }

    async function refreshCurrentCafe() {
      const id = await getCurrentShopId();
      ordering_dispatch({type: OrderingActionName.SET_CURRENT_SHOP_ID, payload: id});
    }
    refreshCurrentCafe().then(() => console.log('Current cafe refreshed'));
    refreshBaskets().then(() => console.log('Basket refreshed'));
  }, []);

  useEffect(() => {
    const subscription = DataStore.observeQuery(Cafe, cafe => cafe, {
      sort: cafe => cafe.name(SortDirection.ASCENDING),
    }).subscribe(snapshot => {
      const {items, isSynced} = snapshot;
      if (isSynced) {
        ordering_dispatch({type: OrderingActionName.SET_CAFES, payload: items});
      }
    });
    return () => subscription.unsubscribe();
  }, [ordering_dispatch]);

  return (
    <OrderingContext.Provider value={{ordering_state, ordering_dispatch}}>
      <SpecificRoot />
    </OrderingContext.Provider>
  );
};

export default Root;
