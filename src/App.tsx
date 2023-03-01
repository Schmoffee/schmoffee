import React, {useEffect, useReducer, useState} from 'react';
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
  const [initLoading, setInitLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  /**
   * This effect runs a dummy database query to manually initiate the synchronisation with the cloud.
   */
  useEffect(() => {
    const init = async () => {
      await getUserById('init');
      setInitLoading(false);
    };
    init().catch(e => {
      console.log('Datastore initialization error ', e);
    });
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
          return fcmToken;
        } else {
          // Alerts.tokenAlert();
        }
      } else {
        NativeModules.RNPushNotification.getToken(
          async (token: string) => {
            global_dispatch({type: GlobalActionName.SET_DEVICE_TOKEN, payload: token});
            await updateEndpoint(token);
            return token;
          },
          (error: any) => {
            // Alerts.tokenAlert();
            console.log(error);
          },
        );
      }
    }

    getDeviceToken().then(token => {
      console.log('device token refreshed: ', token);
      setTokenLoading(false);
    });
  }, []);

  /**
   * This effect attachs 2 listeners respectively to the auth and datastore hub events.
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
    if (!initLoading && !tokenLoading && global_state.device_token !== '') {
      refreshAuthState()
        .then(() => {
          console.log('auth state refreshed');
          setAuthLoading(false);
        })
        .catch(error => {
          console.log(error);
          Alerts.elseAlert();
        });
    } else if (!initLoading && !tokenLoading && global_state.device_token === '') {
      console.log('device token not set');
      setAuthLoading(false);
    }
  }, [global_state.auth_state, global_state.device_token, initLoading, tokenLoading]);

  useEffect(() => {
    if (!authLoading && global_state.auth_state === AuthState.SIGNED_IN && global_state.device_token !== '') {
      const subscription = DataStore.observeQuery(User, user =>
        user.device_token('eq', global_state.device_token),
      ).subscribe(async snapshot => {
        const {items} = snapshot;
        if (items.length > 0) {
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
          console.log('user refreshed');
        }
        global_dispatch({type: GlobalActionName.SET_LOADING, payload: false});
      });
      return () => subscription.unsubscribe();
    } else if (!authLoading && (global_state.auth_state === AuthState.SIGNED_IN || global_state.device_token !== '')) {
      global_dispatch({type: GlobalActionName.SET_LOADING, payload: false});
    }
  }, [authLoading, global_state.auth_state, global_state.device_token]);

  /**
   * Get the user's current order from the database and subscribe to any changes to it.
   */
  useEffect(() => {
    if (!global_state.loading && global_state.current_user !== null) {
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
            global_dispatch({type: GlobalActionName.SET_CURRENT_ORDER, payload: actualOrders[0]});
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
            actualOrders.length === 0
              ? global_dispatch({type: GlobalActionName.SET_CURRENT_ORDER, payload: null})
              : Alerts.elseAlert();
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    // Don't track the current order status, otherwise it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global_state.current_user, global_dispatch, global_state.loading]);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <Navigator />
    </GlobalContext.Provider>
  );
};

export default App;
