import {GlobalAction, GlobalState, HubPayload} from '../types/data.types';
import {AuthState} from '../types/enums';
import {Dispatch} from 'react';
import {updateAuthState} from '../queries/datastore';
import {DataStore} from 'aws-amplify';

const authListener = async (data: {payload: HubPayload}, state: GlobalState, dispatch: Dispatch<GlobalAction>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_IN});
      console.log('user signed in');
      break;
    case 'signUp':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_UP});
      console.log('user signed up');
      break;
    case 'signOut':
      await updateAuthState(state.current_user?.id as string, false);
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_OUT});
      dispatch({type: 'SET_CURRENT_USER', payload: null});
      dispatch({type: 'SET_AUTH_USER', payload: null});
      await DataStore.clear();
      console.log('user signed out');
      break;
    case 'signIn_failure':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNING_IN_FAILED});
      dispatch({type: 'SET_AUTH_USER', payload: null});
      console.log('user sign in failed');
      break;
    case 'tokenRefresh':
      console.log('token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      console.log('token refresh failed');
      break;
    case 'autoSignIn':
      console.log('Auto Sign In after Sign Up succeeded');
      break;
    case 'autoSignIn_failure':
      console.log('Auto Sign In after Sign Up failed');
      break;
  }
};

const datastoreListener = async (hubData: {payload: HubPayload}, dispatch: Dispatch<GlobalAction>) => {
  const {event, data} = hubData.payload;
  switch (event) {
    case 'networkStatus':
      dispatch({type: 'SET_NETWORK_STATUS', payload: data.active});
      console.log(`connected: ${data.active}`);
      break;
    case 'ready':
      console.log('data completely synced from the cloud');
      break;
  }
};

export {authListener, datastoreListener};
