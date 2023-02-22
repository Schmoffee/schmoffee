import React, {useReducer} from 'react';
import {TrackOrderContext, trackOrderData} from '../../contexts';
import {trackOrderReducer} from '../../reducers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrackOrderRoutes} from '../../utils/types/navigation.types';
import {RatingPage} from './screens/RatingPage';
import {OrderPage} from './screens/OrderPage';

const Root = () => {
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
        <>
          <TrackOrderStack.Screen name="OrderPage" component={OrderPage} />
          <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
        </>
      </TrackOrderStack.Navigator>
    </TrackOrderContext.Provider>
  );
};

export default Root;
