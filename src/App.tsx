import React, {useEffect, useReducer} from 'react';
import {globalReducer} from './reducers';
import {GlobalContext, initalData} from './contexts';
import awsConfig from './aws-exports';
import {Amplify} from 'aws-amplify';
Amplify.configure(awsConfig);
import {Hub} from 'aws-amplify';
import {authListener} from './utils/listeners';
import {getCurrentAuthUser} from './utils/queries/auth';
import {AuthState} from './utils/enums';
import {getUserByPhoneNumber, updateAuthState} from './utils/queries/datastore';
import TrackOrder from './flows/TrackOrder/Root';
import SignUpPage from './flows/Authentication/screens/SignUpPage';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Navigator from './navigation/Navigator';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, initalData);
  Hub.listen('auth', data => authListener(data, global_state, global_dispatch));

  useEffect(() => {
    const refreshAuthState = async () => {
      const user = await getCurrentAuthUser();
      if (user) {
        if (global_state.auth_state !== AuthState.SIGNED_IN) {
          global_dispatch({
            type: 'SET_AUTH_STATE',
            payload: AuthState.SIGNED_IN,
          });
        }
        const currentUser = await getUserByPhoneNumber(user.getUsername());
        global_dispatch({
          type: 'SET_CURRENT_USER',
          payload: currentUser,
        });
        await updateAuthState(currentUser?.id as string, true);
        global_dispatch({type: 'SET_AUTH_USER', payload: user});
      }
    };

    refreshAuthState().catch(err => console.log(err));
  }, [global_state.current_user?.id, global_state.auth_state]);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <SafeAreaProvider>
        <Navigator />
      </SafeAreaProvider>
    </GlobalContext.Provider>
  );
};

export default App;
