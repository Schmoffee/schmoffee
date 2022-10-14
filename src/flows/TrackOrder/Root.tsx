import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { GlobalContext, TrackOrderContext, trackOrderData } from '../../contexts';
import { DataStore } from 'aws-amplify';
import { CurrentOrder, User } from '../../models';
import { Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission, subscribeToLocation } from '../../utils/helpers/location';
import { getIsLocatable, setIsLocatable } from '../../utils/helpers/storage';
import { trackOrderReducer } from '../../reducers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrackOrderRoutes } from '../../utils/types/navigation.types';

import { RatingPage } from './screens/RatingPage';
import { OrderPage } from './screens/OrderPage';

const Root = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const [track_order_state, track_order_dispatch] = useReducer(trackOrderReducer, trackOrderData);
  const watchID = useRef<number>(); //used to watch the users location
  const TrackOrderStack = createNativeStackNavigator<TrackOrderRoutes>();

  /**
   * Get the user's current order from the database and subscribe to any changes to it.
   */
  useEffect(() => {
    if (global_state.auth_user && global_state.current_user) {
      const user: User = global_state.current_user;
      const subscription = DataStore.observeQuery(CurrentOrder, current_order =>
        current_order.userID('eq', user.id),
      ).subscribe(snapshot => {
        const { items, isSynced } = snapshot;
        if (items.length === 1) {
          track_order_dispatch({ type: 'SET_CURRENT_ORDER', payload: items[0] });
        } else {
          items.length === 0 ? console.log('No current order found') : console.log('More than one current order found');
        }
        if (isSynced) {
          console.log('Synced');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_dispatch, global_state.auth_user, global_state.current_user]);

  useEffect(() => {
    let currWatch: number | undefined = watchID.current;
    async function trackLocation() {
      if (track_order_state.is_locatable) {
        subscribeToLocation(watchID, global_dispatch);
      } else {
        const authorized = await getIsLocatable();
        if (authorized) track_order_dispatch({ type: 'SET_IS_LOCATABLE', payload: true });
      }
    }

    trackLocation().catch(e => console.log(e));
    return () => {
      if (currWatch) {
        Geolocation.clearWatch(currWatch);
      }
      Geolocation.stopObserving();
    };
  }, [global_dispatch, track_order_state.is_locatable]);

  async function handleLocationRequest() {
    const authorized = await requestLocationPermission();
    track_order_dispatch({ type: 'SET_IS_LOCATABLE', payload: authorized });
    await setIsLocatable(true);
  }

  return (
    <TrackOrderContext.Provider value={{ track_order_state, track_order_dispatch }}>
      <TrackOrderStack.Navigator
        initialRouteName='RatingPage'
        screenOptions={{
          headerShown: false,
          gestureEnabled: true
        }}>
        <TrackOrderStack.Screen name="OrderPage" component={OrderPage} />
        <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
      </TrackOrderStack.Navigator>
    </TrackOrderContext.Provider>
  );
};

export default Root;

