import React, {useReducer} from 'react';
import {globalReducer} from './reducers';
import {GlobalContext, initalData} from './contexts';
import awsConfig from './aws-exports';
import {Amplify} from 'aws-amplify';
Amplify.configure(awsConfig);
import {Hub} from 'aws-amplify';
import {authListener} from './utils/listeners';
import SignUpPage from './screens /SignUpPage';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, initalData);
  Hub.listen('auth', data => authListener(data, global_dispatch));

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <SignUpPage />
    </GlobalContext.Provider>
  );
};

export default App;
