import React, {useEffect, useReducer} from 'react';
import {orderingData, OrderingContext} from '../../contexts';
import {orderingReducer} from '../../reducers';
import SpecificRoot from './Specific/Root';
import {getCommonBasket, getSpecificBasket} from '../../utils/helpers/storage';
import {OrderItem} from '../../models';
import {CommonBasketItem} from '../../utils/types/data.types';

const Root = () => {
  const [ordering_state, ordering_dispatch] = useReducer(orderingReducer, orderingData);

  useEffect(() => {
    async function refreshBaskets() {
      const common_basket: CommonBasketItem[] = await getCommonBasket();
      const specific_basket: OrderItem[] = await getSpecificBasket();
      ordering_dispatch({type: 'SET_SPECIFIC_BASKET', payload: specific_basket});
      ordering_dispatch({type: 'SET_COMMON_BASKET', payload: common_basket});
    }
    refreshBaskets().then(() => console.log('Baskets refreshed'));
  }, []);
  return (
    <OrderingContext.Provider value={{ordering_state, ordering_dispatch}}>
      <SpecificRoot />
    </OrderingContext.Provider>
  );
};

export default Root;
