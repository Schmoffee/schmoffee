import React, {useContext, useEffect, useReducer} from 'react';
import {GlobalContext, TrackOrderContext, trackOrderData} from '../../contexts';
import {trackOrderReducer} from '../../reducers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrackOrderRoutes} from '../../utils/types/navigation.types';
import {RatingPage} from './screens/RatingPage';
import {OrderPage} from './screens/OrderPage';
import {DataStore} from 'aws-amplify';
import {Cafe} from '../../models';
import {GlobalState} from '../../utils/types/data.types';
import {TrackOrderActionName} from '../../utils/types/enums';

const Root = () => {
  const {global_state} = useContext(GlobalContext);
  const [track_order_state, track_order_dispatch] = useReducer(trackOrderReducer, trackOrderData);
  const TrackOrderStack = createNativeStackNavigator<TrackOrderRoutes>();

  useEffect(() => {
    async function getOrderCafe(cafeID: string) {
      const cafe = await DataStore.query(Cafe, cafeID);
      if (cafe) {
        track_order_dispatch({type: TrackOrderActionName.SET_SHOP, payload: cafe});
      }
    }

    if (global_state.current_order) {
      getOrderCafe(global_state.current_order.cafeID).then(() => {
        console.log('cafe set');
      });
    }
  }, [global_state.current_order]);

  return (
    <TrackOrderContext.Provider value={{track_order_state, track_order_dispatch}}>
      <TrackOrderStack.Navigator
        initialRouteName="OrderPage"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <>
          <TrackOrderStack.Screen name="OrderPage" component={OrderPage} />
          <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
        </>
      </TrackOrderStack.Navigator>
    </TrackOrderContext.Provider>
  );
};

export default Root;
