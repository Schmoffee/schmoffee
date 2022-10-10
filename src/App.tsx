import React, { useEffect, useReducer } from 'react';
import { globalReducer } from './reducers';
import { GlobalContext, globalData } from './contexts';
import awsConfig from './aws-exports';
import { Amplify } from 'aws-amplify';
Amplify.configure(awsConfig);
import { Hub } from 'aws-amplify';
import { authListener, datastoreListener } from './utils/listeners';
import { getCurrentAuthUser } from './utils/queries/auth';
import { AuthState } from './utils/enums';
import { getUserByPhoneNumber, updateAuthState } from './utils/queries/datastore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigator from './navigation/Navigator';
import { LocalUser } from './utils/types/data.types';
import LiquidSwipe from './components/LiquidSwipe';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, globalData);

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
      console.log(user);
      if (user) {
        if (global_state.auth_state !== AuthState.SIGNED_IN) {
          global_dispatch({
            type: 'SET_AUTH_STATE',
            payload: AuthState.SIGNED_IN,
          });
        }
        const currentUser = await getUserByPhoneNumber(user.getUsername());
        if (currentUser) {
          const localUser: LocalUser = {
            id: currentUser.id,
            name: currentUser.name,
            is_signed_in: currentUser.is_signed_in,
            phone: currentUser.phone,
            payment_method: currentUser.payment_method,
            the_usual: currentUser.the_usual,
          };
          console.log(currentUser);
          global_dispatch({
            type: 'SET_CURRENT_USER',
            payload: localUser,
          });
          await updateAuthState(currentUser?.id as string, true);
          global_dispatch({ type: 'SET_AUTH_USER', payload: user });
        } else {
          console.log('We have a problem');
        }
      }
    };

    refreshAuthState().catch(err => console.log(err));
  }, [global_state.current_user?.id, global_state.auth_state]);

  return (
    <GlobalContext.Provider value={{ global_state, global_dispatch }}>
      <SafeAreaProvider>
        <Navigator />
      </SafeAreaProvider>
    </GlobalContext.Provider>
  );
};

export default App;
