import React, {useContext, useEffect, useReducer, useRef} from 'react';
import {GlobalContext, TrackOrderContext, trackOrderData} from '../../contexts';
import {DataStore} from 'aws-amplify';
import {CurrentOrder, OrderStatus, User} from '../../models';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission, subscribeToLocation} from '../../utils/helpers/location';
import {getIsLocatable, setIsLocatable} from '../../utils/helpers/storage';
import {trackOrderReducer} from '../../reducers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrackOrderRoutes} from '../../utils/types/navigation.types';
import {RatingPage} from './screens/RatingPage';
import {OrderPage} from './screens/OrderPage';
import {confirmPaymentSheetPayment} from '@stripe/stripe-react-native';
import {Alert} from 'react-native';
import {cancelPayment} from '../../utils/helpers/payment';
import {deleteOrder} from '../../utils/queries/datastore';

const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
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
      ).subscribe(async snapshot => {
        const {items, isSynced} = snapshot;
        if (isSynced) {
          if (items.length === 1) {
            const prevStatus = track_order_state.current_order?.status;
            const new_order = items[0];
            if (new_order.status !== prevStatus) {
              switch (new_order.status) {
                case OrderStatus.ACCEPTED:
                  await confirmPayment();
                  break;
                case OrderStatus.REJECTED:
                  console.log(new_order.order_info.rejection_justification);
                  await cancelPayment(new_order.payment_id);
                  await deleteOrder(new_order.id);
              }
            }
            track_order_dispatch({type: 'SET_CURRENT_ORDER', payload: items[0]});
          } else {
            items.length === 0
              ? console.log('No current order found')
              : console.log('More than one current order found');
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_dispatch, global_state.auth_user, global_state.current_user]);

  useEffect(() => {
    let currWatch: number | undefined = watchID.current;
    async function trackLocation() {
      if (track_order_state.is_locatable) {
        subscribeToLocation(watchID, track_order_dispatch);
      } else {
        const authorized = await getIsLocatable();
        if (authorized) track_order_dispatch({type: 'SET_IS_LOCATABLE', payload: true});
        else await handleLocationRequest();
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
    track_order_dispatch({type: 'SET_IS_LOCATABLE', payload: authorized});
    await setIsLocatable(true);
  }

  async function confirmPayment() {
    const {error} = await confirmPaymentSheetPayment();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  }

  return (
    <TrackOrderContext.Provider value={{track_order_state, track_order_dispatch}}>
      <TrackOrderStack.Navigator
        initialRouteName="OrderPage"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <TrackOrderStack.Screen name="OrderPage" component={OrderPage} />
        <TrackOrderStack.Screen name="RatingPage" component={RatingPage} />
      </TrackOrderStack.Navigator>
    </TrackOrderContext.Provider>
  );
};

export default Root;
