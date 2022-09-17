import {GlobalAction, HubPayload} from './types';
import {AuthState} from './enums';
import {Dispatch} from 'react';
import DeviceInfo from 'react-native-device-info';
import {createAnonymousUser, getUserByDeviceId} from './queries/datastore';

const authListener = async (
  data: {payload: HubPayload},
  dispatch: Dispatch<GlobalAction>,
) => {
  const uniqueId: string = await DeviceInfo.getUniqueId();
  const existingUser = await getUserByDeviceId(uniqueId);
  switch (data.payload.event) {
    case 'signIn':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_IN});
      dispatch({type: 'SET_CURRENT_USER', payload: existingUser});
      console.log('user signed in');
      break;
    case 'signUp':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_IN});
      console.log('user signed up');
      break;
    case 'signOut':
      dispatch({type: 'SET_AUTH_STATE', payload: AuthState.SIGNED_OUT});
      if (existingUser) {
        dispatch({type: 'SET_CURRENT_USER', payload: existingUser});
      } else {
        const newUser = await createAnonymousUser(uniqueId);
        dispatch({type: 'SET_CURRENT_USER', payload: newUser});
      }
      console.log('user signed out');
      break;
    case 'signIn_failure':
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
    case 'configured':
      console.log('the Auth module is configured');
  }
};

export {authListener};
