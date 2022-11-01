import React, {useEffect, useReducer} from 'react';
import {NativeModules} from 'react-native';
import {globalReducer} from './reducers';
import {GlobalContext, globalData} from './contexts';
import {Hub} from 'aws-amplify';
import {authListener, datastoreListener} from './utils/helpers/listeners';
import {getCurrentAuthUser, signOut} from './utils/queries/auth';
import {AuthState} from './utils/types/enums';
import {getUserByPhoneNumber, updateDeviceToken} from './utils/queries/datastore';
import {LocalUser} from './utils/types/data.types';
import {updateEndpoint} from './utils/helpers/notifications';
import Navigator from './navigation/Navigator';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, globalData);

  useEffect(() => {
    NativeModules.RNPushNotification.getToken(
      async (token: string) => {
        global_dispatch({type: 'SET_DEVICE_TOKEN', payload: token});
        console.log('token', token);
      },
      (error: any) => {
        console.log(error);
      },
    );
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
          if (current_token === '') {
            await updateDeviceToken(currentUser.id, global_state.device_token);
          } else if (global_state.device_token !== current_token) {
            await signOut();
          } else {
            if (global_state.auth_state !== AuthState.SIGNED_IN) {
              global_dispatch({
                type: 'SET_AUTH_STATE',
                payload: AuthState.SIGNED_IN,
              });
            }
            global_dispatch({type: 'SET_AUTH_USER', payload: user});
            await updateEndpoint(global_state.device_token, user.sub);
            const localUser: LocalUser = {
              id: currentUser.id,
              name: currentUser.name,
              phone: currentUser.phone,
              payment_method: currentUser.payment_method,
              the_usual: currentUser.the_usual,
              customer_id: currentUser.customer_id,
              device_token: global_state.device_token,
            };
            global_dispatch({
              type: 'SET_CURRENT_USER',
              payload: localUser,
            });
          }
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

    refreshAuthState().catch(error => console.log(error));
  }, [global_state.current_user?.id, global_state.auth_state]);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <Navigator />
    </GlobalContext.Provider>
  );
};

export default App;
