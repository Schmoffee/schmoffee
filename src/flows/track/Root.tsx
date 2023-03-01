import React, {useContext, useReducer} from 'react';
import {GlobalContext, TrackOrderContext, trackOrderData} from '../../contexts';
import {trackOrderReducer} from '../../reducers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrackOrderRoutes} from '../../utils/types/navigation.types';
import {RatingPage} from './screens/RatingPage';
import {OrderPage} from './screens/OrderPage';
import {OrderStatus} from '../../models';

const Root = () => {
  const {global_state} = useContext(GlobalContext);
  const [track_order_state, track_order_dispatch] = useReducer(trackOrderReducer, trackOrderData);
  const TrackOrderStack = createNativeStackNavigator<TrackOrderRoutes>();

  return (
    <TrackOrderContext.Provider value={{track_order_state, track_order_dispatch}}>
      <TrackOrderStack.Navigator
        initialRouteName="OrderPage"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        {global_state.current_order?.status === OrderStatus.COLLECTED ? (
          <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
        ) : (
          <>
            <TrackOrderStack.Screen name="OrderPage" component={OrderPage} />
            <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
          </>
        )}
      </TrackOrderStack.Navigator>
    </TrackOrderContext.Provider>
  );
};

export default Root;
