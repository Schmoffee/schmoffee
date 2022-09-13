import React from 'react';
import {GlobalState} from './utils/types';

export const initalData: GlobalState = {
  current_user: null,
  scheduled_time: null,
  the_usual: null,
  current_shop: null,
  common_basket: [],
  specific_basket: [],
};

export const GlobalContext = React.createContext<{
  global_state: GlobalState;
  global_dispatch: React.Dispatch<any>;
}>({
  global_state: initalData,
  global_dispatch: () => null,
});
