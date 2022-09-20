import React from 'react';
import {GlobalState} from './utils/types';
import {AuthState} from './utils/enums';

export const initalData: GlobalState = {
  auth_state: AuthState.SIGNED_OUT,
  common_items: [],
  current_user: null,
  scheduled_time: null,
  the_usual: null,
  current_shop: null,
  common_basket: [],
  specific_basket: [],
  auth_user: null,
};

export const GlobalContext = React.createContext<{
  global_state: GlobalState;
  global_dispatch: React.Dispatch<any>;
}>({
  global_state: initalData,
  global_dispatch: () => null,
});
