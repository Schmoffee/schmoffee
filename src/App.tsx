import React, {useEffect, useReducer} from 'react';
import {Alert, BackHandler, NativeModules, Platform} from 'react-native';
import {globalReducer} from './reducers';
import {GlobalContext, globalData} from './contexts';
import {DataStore, Hub} from 'aws-amplify';
import {authListener, datastoreListener} from './utils/helpers/listeners';
import {getCurrentAuthUser, signOut} from './utils/queries/auth';
import {AuthState} from './utils/types/enums';
import {getUserById, getUserByPhoneNumber, updateDeviceToken} from './utils/queries/datastore';
import {LocalUser} from './utils/types/data.types';
import {updateEndpoint} from './utils/helpers/notifications';
import Navigator from './navigation/Navigator';
import {User} from './models';
import {firebase} from '@react-native-firebase/messaging';
signOut();
const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, globalData);

  useEffect(() => {
    const init = async () => {
      // Instead of using Datastore.start().
      await getUserById('init');
    };
    init().catch(e => console.log(e));
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('back pressed');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    async function getDeviceToken() {
      if (Platform.OS === 'ios') {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          global_dispatch({type: 'SET_DEVICE_TOKEN', payload: fcmToken});
          await updateEndpoint(fcmToken);
        } else {
          Alert.alert('Failed', 'No token received');
        }
      } else {
        NativeModules.RNPushNotification.getToken(
          async (token: string) => {
            global_dispatch({type: 'SET_DEVICE_TOKEN', payload: token});
            await updateEndpoint(token);
          },
          (error: any) => {
            Alert.alert('Failed', 'No token received');
            console.log(error);
          },
        );
      }
    }

    getDeviceToken().then(() => console.log('device token refreshed'));
  }, []);

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
              type: 'SET_AUTH_STATE',
              payload: AuthState.SIGNED_IN,
            });
          }
          global_dispatch({type: 'SET_AUTH_USER', payload: user});
        } else {
          await signOut();
          console.log('Auth user found but corresponding database user not found');
        }
      } else {
        global_dispatch({
          type: 'SET_AUTH_STATE',
          payload: AuthState.SIGNED_OUT,
        });
      }
    };
    if (global_state.device_token !== '') {
      refreshAuthState().catch(error => console.log(error));
    }
  }, [global_state.current_user?.id, global_state.auth_state, global_state.device_token]);

  useEffect(() => {
    const subscription = DataStore.observeQuery(User, user =>
      user.device_token('eq', global_state.device_token),
    ).subscribe(async snapshot => {
      const {items} = snapshot;
      if (global_state.auth_state === AuthState.SIGNED_IN && items.length > 0) {
        const currentUser = items[0];
        const localUser: LocalUser = {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          payment_method: currentUser.payment_method,
          the_usual: currentUser.the_usual,
          customer_id: currentUser.customer_id,
          device_token: global_state.device_token,
        };
        global_dispatch({type: 'SET_CURRENT_USER', payload: localUser});
      }
    });
    return () => subscription.unsubscribe();
  }, [global_state.auth_state, global_state.device_token]);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <Navigator />
    </GlobalContext.Provider>
  );
};

export default App;
