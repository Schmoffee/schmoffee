import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useReducer} from 'react';
import {AuthRoutes} from '../../utils/types/navigation.types';
import {getFreeTime, getIsFirstTime, getPhone, getTrials, setFreeTime, setTrials} from '../../utils/helpers/storage';
import {signIn} from '../../utils/queries/auth';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState, ErrorTypes, GlobalActionName, SignInActionName} from '../../utils/types/enums';
import {GlobalContext, SignInContext, signInData} from '../../contexts';
import {signInReducer} from '../../reducers';
import {Alert} from 'react-native';
import {checkMultiSignIn, getUserById, newSignIn} from '../../utils/queries/datastore';
import {Intro} from './screens/Intro';
import {AuthPage} from './screens/AuthPage';
import {Alerts} from '../../utils/helpers/alerts';

const Root = () => {
  const AuthStack = createNativeStackNavigator<AuthRoutes>();
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [sign_in_state, sign_in_dispatch] = useReducer(signInReducer, signInData);
  const [isFirstTime, setIsFirstTime] = React.useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      // Instead of using Datastore.start() to force a cloud sync.
      await getUserById('init');
      const is_first: boolean = await getIsFirstTime();
      setIsFirstTime(is_first);
    };
    init().catch(e => console.log(e));
  }, []);

  useEffect(() => {
    async function refreshState() {
      const trials = await getTrials();
      if (trials) {
        sign_in_dispatch({type: SignInActionName.SET_TRIALS, payload: +trials});
      }
      const blocked_time = await getFreeTime();
      if (blocked_time) {
        sign_in_dispatch({type: SignInActionName.SET_BLOCKED_TIME, payload: +blocked_time});
      }
      const phone = await getPhone();
      if (phone) {
        sign_in_dispatch({type: SignInActionName.SET_PHONE, payload: phone});
      }
    }

    refreshState().then(() => console.log('refreshed sign in state'));
  }, [global_state.synced]);

  async function sendOTP(phoneNumber: string) {
    const trials = await getTrials();
    if (+trials <= 10000) {
      const user_id = await checkMultiSignIn(phoneNumber, global_state.device_token);
      if (user_id) {
        Alert.alert(
          'Already signed in',
          'You are already signed in on another device. You will be signed out of the other device.',
          [
            {
              text: 'OK',
              onPress: async () => {
                const success = await initiateSignIn(phoneNumber, +trials);
                if (success) {
                  await newSignIn(user_id);
                  return true;
                }
                return false;
              },
            },
            {
              text: 'Cancel',
              onPress: () => {
                return false;
              },
            },
          ],
        );
      } else {
        return await initiateSignIn(phoneNumber, +trials);
      }
    } else {
      if (sign_in_state.blocked_time === 0) {
        const free_time = Date.now() + 60 * 60000;
        sign_in_dispatch({type: SignInActionName.SET_BLOCKED_TIME, payload: free_time});
        await setFreeTime(free_time);
      }
      const remaining_time: number = new Date(sign_in_state.blocked_time - Date.now()).getSeconds();
      Alert.alert(
        'Too many tries',
        `You have exceeded the maximum number of trials. Please try again after ${remaining_time} minutes.`,
      );
      return false;
    }
    return false;
  }

  async function initiateSignIn(phoneNumber: string, trials: number) {
    const newSession = await signIn(phoneNumber);
    if (newSession && newSession instanceof CognitoUser) {
      sign_in_dispatch({type: SignInActionName.SET_TRIALS, payload: +trials + 1});
      await setTrials(+trials + 1);
      global_dispatch({
        type: GlobalActionName.SET_AUTH_STATE,
        payload: AuthState.CONFIRMING_OTP,
      });
      sign_in_dispatch({type: SignInActionName.SET_SESSION, payload: newSession});
      return true;
    } else {
      if (newSession === ErrorTypes.USER_NOT_EXIST) {
        Alerts.badPhoneNumberAlert();
      } else {
        Alerts.signInErrorAlert();
      }
      return false;
    }
  }

  return (
    <SignInContext.Provider value={{sign_in_state, sign_in_dispatch, sendOTP}}>
      <AuthStack.Navigator
        initialRouteName="AuthPage"
        screenOptions={{
          headerShown: false,
        }}>
        {isFirstTime && <AuthStack.Screen name="Intro" component={Intro} />}
        <AuthStack.Screen name="AuthPage" component={AuthPage} />
      </AuthStack.Navigator>
    </SignInContext.Provider>
  );
};

export default Root;
