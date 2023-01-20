import {GlobalAction, GlobalState, HubPayload} from '../types/data.types';
import {AuthState, GlobalActionName} from '../types/enums';
import {Dispatch} from 'react';
import {DataStore} from 'aws-amplify';

const authListener = async (data: {payload: HubPayload}, state: GlobalState, dispatch: Dispatch<GlobalAction>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch({type: GlobalActionName.SET_AUTH_STATE, payload: AuthState.SIGNED_IN});
      console.log('user signed in');
      break;
    case 'signUp':
      dispatch({type: GlobalActionName.SET_AUTH_STATE, payload: AuthState.SIGNED_UP});
      console.log('user signed up');
      break;
    case 'signOut':
      await DataStore.clear();
      dispatch({type: GlobalActionName.SET_AUTH_STATE, payload: AuthState.SIGNED_OUT});
      dispatch({type: GlobalActionName.SET_CURRENT_USER, payload: null});
      dispatch({type: GlobalActionName.SET_AUTH_USER, payload: null});
      console.log('user signed out');
      break;
    case 'signIn_failure':
      dispatch({type: GlobalActionName.SET_AUTH_STATE, payload: AuthState.SIGNING_IN_FAILED});
      dispatch({type: GlobalActionName.SET_AUTH_USER, payload: null});
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
      dispatch({type: GlobalActionName.SET_NETWORK_STATUS, payload: data.active});
      console.log(`connected: ${data.active}`);
      break;
    case 'ready':
      console.log('data completely synced from the cloud');
      dispatch({type: GlobalActionName.SET_SYNCED, payload: true});
      break;
  }
};

export {authListener, datastoreListener};
