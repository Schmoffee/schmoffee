import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useReducer} from 'react';
import {AuthRoutes} from '../../utils/types/navigation.types';
import {Signup} from './screens/Signup';
import {VerifyMobile} from './screens/VerifyMobile';
import {getFreeTime, getPhone, getTrials, setFreeTime, setTrials} from '../../utils/helpers/storage';
import {signIn} from '../../utils/queries/auth';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState} from '../../utils/types/enums';
import {GlobalContext, SignInContext, signInData} from '../../contexts';
import {signInReducer} from '../../reducers';
import {checkMultiSignIn} from '../../utils/queries/datastore';
import {Alert} from 'react-native';

const Root = () => {
  const AuthStack = createNativeStackNavigator<AuthRoutes>();
  const {global_dispatch} = useContext(GlobalContext);
  const [sign_in_state, sign_in_dispatch] = useReducer(signInReducer, signInData);

  useEffect(() => {
    async function refreshState() {
      const trials = await getTrials();
      if (trials) {
        sign_in_dispatch({type: 'SET_TRIALS', payload: +trials});
      }
      const blocked_time = await getFreeTime();
      if (blocked_time) {
        sign_in_dispatch({type: 'SET_BLOCKED_TIME', payload: +blocked_time});
      }
      const phone = await getPhone();
      if (phone) {
        sign_in_dispatch({type: 'SET_PHONE', payload: phone});
      }
    }

    refreshState().then(() => console.log('refreshed sign in state'));
  }, []);

  async function sendOTP(phoneNumber: string) {
    const trials = await getTrials();
    if (+trials <= 1) {
      const is_already_in = await checkMultiSignIn(phoneNumber);
      if (is_already_in) {
        Alert.alert('You are already signed in on another device. You will be signed out of the other device.');
      }
      const newSession = await signIn(phoneNumber);
      if (newSession && newSession instanceof CognitoUser) {
        sign_in_dispatch({type: 'SET_TRIALS', payload: +trials + 1});
        await setTrials(+trials + 1);
        global_dispatch({
          type: 'SET_AUTH_STATE',
          payload: AuthState.CONFIRMING_OTP,
        });
      } else {
        //TODO: Handle the error appropriately depending on the error type
      }
    } else {
      if (sign_in_state.blocked_time === 0) {
        const free_time = Date.now() + 60 * 60000;
        sign_in_dispatch({type: 'SET_BLOCKED_TIME', payload: free_time});
        await setFreeTime(free_time);
      }
      const remaining_time = sign_in_state.blocked_time - Date.now();
      Alert.alert(`You have exceeded the maximum number of trials. Please try again after ${remaining_time} minutes.`);
    }
  }

  return (
    <SignInContext.Provider value={{sign_in_state, sign_in_dispatch, sendOTP}}>
      <AuthStack.Navigator
        initialRouteName="Signup"
        screenOptions={{
          headerShown: false,
        }}>
        {/* <AuthStack.Screen name="Intro" component={Intro} /> */}
        <AuthStack.Screen name="Signup" component={Signup} />
        <AuthStack.Screen name="VerifyMobile" component={VerifyMobile} />
      </AuthStack.Navigator>
    </SignInContext.Provider>
  );
};

export default Root;
