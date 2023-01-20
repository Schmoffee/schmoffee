import React, {useContext, useReducer} from 'react';
import {GlobalContext, TrackOrderContext, trackOrderData} from '../../contexts';
import {DataStore} from 'aws-amplify';
import {CurrentOrder, OrderStatus} from '../../models';
import {getClientSecret} from '../../utils/helpers/storage';
import {trackOrderReducer} from '../../reducers';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrackOrderRoutes} from '../../utils/types/navigation.types';
import {RatingPage} from './screens/RatingPage';
import {OrderPage} from './screens/OrderPage';
import {confirmApplePayPayment, confirmPaymentSheetPayment} from '@stripe/stripe-react-native';
import {Alert} from 'react-native';
import {cancelPayment, confirmGooglePayPayment} from '../../utils/helpers/payment';
import {deleteOrder} from '../../utils/queries/datastore';
import {LocalUser, Payment} from '../../utils/types/data.types';
import {useDeepCompareEffect} from 'react-use';
import {TrackOrderActionName} from '../../utils/types/enums';

const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [track_order_state, track_order_dispatch] = useReducer(trackOrderReducer, trackOrderData);
  const TrackOrderStack = createNativeStackNavigator<TrackOrderRoutes>();

  /**
   * Get the user's current order from the database and subscribe to any changes to it.
   */
  useDeepCompareEffect(() => {
    if (global_state.current_user !== null) {
      const user: LocalUser = global_state.current_user;
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
                  await confirmPayment(user.payment_method as Payment, new_order.payment_id);
                  break;
                case OrderStatus.REJECTED:
                  await cancelPayment(new_order.payment_id);
                  await deleteOrder(new_order.id);
                  break;
              }
            }
            track_order_dispatch({type: TrackOrderActionName.SET_CURRENT_ORDER, payload: items[0]});
          } else {
            items.length === 0
              ? console.log('No current order found')
              : console.log('More than one current order found');
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_dispatch, global_state.current_user, track_order_state.current_order?.status]);

  // useEffect(() => {
  //   let currWatch: number | undefined = watchID.current;
  //   async function trackLocation() {
  //     const locatable = await handleLocationRequest();
  //     if (locatable) subscribeToLocation(watchID, track_order_dispatch);
  //   }
  //   trackLocation()
  //     .then(() => console.log('tracking'))
  //     .catch(e => console.log(e));
  //   return () => {
  //     if (currWatch) {
  //       Geolocation.clearWatch(currWatch);
  //     }
  //   };
  // }, [global_dispatch, track_order_state.is_locatable]);
  //
  // async function handleLocationRequest() {
  //   return await requestLocationPermission();
  // }

  async function confirmPayment(mode: Payment, payment_id: string) {
    if (mode === 'card') {
      const {error} = await confirmPaymentSheetPayment();
      if (error) {
        Alert.alert(`Error confirming card payment: ${error.code}`, error.message);
      }
    } else if (mode === 'google') {
      await confirmGooglePayPayment(payment_id);
    } else if (mode === 'apple') {
      const secret = await getClientSecret();
      if (secret != null) {
        await confirmApplePayPayment(secret);
      } else {
        Alert.alert('Error', 'Unable to confirm apple pay payment');
      }
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
