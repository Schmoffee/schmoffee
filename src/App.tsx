import React, {useEffect, useReducer, useRef, useState} from 'react';
import {BackHandler, NativeModules, Platform} from 'react-native';
import {globalReducer} from './reducers';
import {GlobalContext, globalData} from './contexts';
import {DataStore, Hub} from 'aws-amplify';
import {authListener, datastoreListener} from './utils/helpers/listeners';
import {getCurrentAuthUser, signOut} from './utils/queries/auth';
import {AuthState, GlobalActionName} from './utils/types/enums';
import {getPastOrders, getUserById, getUserByPhoneNumber, updateDeviceToken} from './utils/queries/datastore';
import {LocalUser, Payment} from './utils/types/data.types';
import {updateEndpoint} from './utils/helpers/notifications';
import Navigator from './navigation/Navigator';
import {CurrentOrder, OrderStatus, PastOrder, User} from './models';
import {firebase} from '@react-native-firebase/messaging';
import {Alerts} from './utils/helpers/alerts';
import {cancelPayment, confirmPayment} from './utils/helpers/payment';
import {getDeletedOrders} from './utils/helpers/storage';
const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, globalData);
  const [loading, setLoading] = useState(false);
  const authLoading = useRef(true);

  /**
   * This effect runs a dummy database query to manually initiate the synchronisation with the cloud.
   */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await getUserById('init');
      setLoading(false);
    };
    if (!loading) {
      init().catch(e => {
        console.log('dccs', e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * This effect attaches a listener to the back button events on Android to create a custom behaviour.
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  /**
   * Get the unique device token for the current device and update he endpoint.
   */
  useEffect(() => {
    async function getDeviceToken() {
      if (Platform.OS === 'ios') {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          global_dispatch({type: GlobalActionName.SET_DEVICE_TOKEN, payload: fcmToken});
          await updateEndpoint(fcmToken);
        } else {
          // Alerts.tokenAlert();
        }
      } else {
        NativeModules.RNPushNotification.getToken(
          async (token: string) => {
            global_dispatch({type: GlobalActionName.SET_DEVICE_TOKEN, payload: token});
            await updateEndpoint(token);
          },
          (error: any) => {
            // Alerts.tokenAlert();
            console.log(error);
          },
        );
      }
    }

    getDeviceToken().then(() => console.log('device token refreshed'));
  }, []);

  /**
   * This effect attaches 2 listeners respectively to the auth and datastore hub events.
   */
  useEffect(() => {
    const auth_hub = Hub.listen('auth', data => authListener(data, global_state, global_dispatch));
    const datastore_hub = Hub.listen('datastore', data => datastoreListener(data, global_dispatch));
    return () => {
      auth_hub();
      datastore_hub();
    };
  }, [global_state]);

  useEffect(() => {
    const refreshAuthState = async () => {
      const user = await getCurrentAuthUser();
      if (user) {
        const currentUser = await getUserByPhoneNumber(user.user.getUsername());
        if (currentUser) {
          let current_token = currentUser.device_token;
          const device_token = global_state.device_token;
          if (current_token === '') await updateDeviceToken(currentUser.id, global_state.device_token);
          else if (device_token !== '' && device_token !== current_token) {
            await signOut();
            return;
          }
          if (global_state.auth_state !== AuthState.SIGNED_IN) {
            global_dispatch({
              type: GlobalActionName.SET_AUTH_STATE,
              payload: AuthState.SIGNED_IN,
            });
          }
          global_dispatch({type: GlobalActionName.SET_AUTH_USER, payload: user});
        } else {
          await signOut();
        }
      } else {
        global_dispatch({
          type: GlobalActionName.SET_AUTH_STATE,
          payload: AuthState.SIGNED_OUT,
        });
      }
    };
    if (!loading) {
      refreshAuthState().catch(error => {
        console.log(error);
        Alerts.elseAlert();
      });
      authLoading.current = false;
    }
  }, [global_state.current_user?.id, global_state.auth_state, global_state.device_token, loading]);

  useEffect(() => {
    if (!loading) {
      const subscription = DataStore.observeQuery(User, user =>
        user.device_token('eq', global_state.device_token),
      ).subscribe(async snapshot => {
        const {items} = snapshot;

        if (global_state.auth_state === AuthState.SIGNED_IN && items.length > 0) {
          const currentUser = items[0];
          const past_orders: PastOrder[] = await getPastOrders(currentUser.id);
          const localUser: LocalUser = {
            id: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone,
            payment_method: currentUser.payment_method,
            the_usual: currentUser.the_usual,
            customer_id: currentUser.customer_id,
            device_token: global_state.device_token,
            past_orders: past_orders,
          };
          global_dispatch({type: GlobalActionName.SET_CURRENT_USER, payload: localUser});
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_state.auth_state, global_state.device_token, loading]);

  /**
   * Get the user's current order from the database and subscribe to any changes to it.
   */
  useEffect(() => {
    if (global_state.current_user !== null && !loading) {
      const user: LocalUser = global_state.current_user;
      const subscription = DataStore.observeQuery(CurrentOrder, current_order =>
        current_order.userID('eq', user.id),
      ).subscribe(async snapshot => {
        const {items, isSynced} = snapshot;
        const deletedOrders: string[] | void = await getDeletedOrders();
        const actualOrders = items.filter(item => !deletedOrders?.includes(item.id));
        if (isSynced) {
          if (actualOrders.length === 1) {
            const prevStatus = global_state.current_order?.status;
            const new_order = actualOrders[0];
            global_dispatch({type: GlobalActionName.SET_CURRENT_ORDER, payload: new_order});
            if (new_order.status !== prevStatus) {
              switch (new_order.status) {
                case OrderStatus.ACCEPTED:
                  await confirmPayment(user.payment_method as Payment, new_order.payment_id);
                  break;
                case OrderStatus.REJECTED:
                  await cancelPayment(new_order.payment_id);
                  break;
              }
            }
          } else {
            console.log('no current order');
            actualOrders.length === 0
              ? global_dispatch({type: GlobalActionName.SET_CURRENT_ORDER, payload: null})
              : Alerts.elseAlert();
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    // Don't track the current order status, otherwise it will cause an infinite loop.
  }, [global_state.current_user, loading, global_dispatch]);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <Navigator loading={authLoading.current} />
    </GlobalContext.Provider>
  );
};

export default App;
