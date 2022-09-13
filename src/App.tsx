/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useReducer} from 'react';
import {SafeAreaView} from 'react-native';
import {globalReducer} from './reducers';
import {GlobalContext, initalData} from './contexts';

const App = () => {
  const [global_state, global_dispatch] = useReducer(globalReducer, initalData);

  return (
    <GlobalContext.Provider value={{global_state, global_dispatch}}>
      <SafeAreaView />
    </GlobalContext.Provider>
  );
};

export default App;
