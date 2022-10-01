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
import {getUserByPhoneNumber} from './utils/queries/datastore';
import TrackOrder from './flows/TrackOrder/Root';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, initalData);
  Hub.listen('auth', data => authListener(data, global_state, global_dispatch));

  const refreshAuthState = async () => {
    const user = await getCurrentAuthUser();
    if (user) {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNED_IN,
      });
      const currentUser = await getUserByPhoneNumber(user.getUsername());
      global_dispatch({
        type: 'SET_CURRENT_USER',
        payload: currentUser,
      });
    } else {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNED_OUT,
      });
    }
    global_dispatch({type: 'SET_AUTH_USER', payload: user});
  };

  useEffect(() => {
    refreshAuthState().catch(err => console.log(err));
  }, []);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <TrackOrder />
    </GlobalContext.Provider>
  );
};

export default App;
