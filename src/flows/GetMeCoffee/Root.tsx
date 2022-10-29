import React, { useReducer } from 'react';
import { View } from 'react-native';
import { orderingData, OrderingContext } from '../../contexts';
import { orderingReducer } from '../../reducers';
import CommonRoot from './Common/Root';
import SpecificRoot from './Specific/Root';



const Root = () => {
  const [ordering_state, ordering_dispatch] = useReducer(orderingReducer, orderingData);
  return (
    <OrderingContext.Provider value={{ ordering_state, ordering_dispatch }}>
      <SpecificRoot />
    </OrderingContext.Provider>

  );
};

export default Root;
