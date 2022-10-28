import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, NativeModules, Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import FormField from '../../../components/Input/FormField';
import { globalSignOut, sendChallengeAnswer, signIn, signOut, signUp } from '../../../utils/queries/auth';
import { GlobalContext } from '../../../contexts';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AuthState, ErrorTypes } from '../../../utils/types/enums';
import LoadingPage from '../../CommonScreens/LoadingPage';
import { createSignUpUser, getUserByPhoneNumber, updateDeviceToken } from '../../../utils/queries/datastore';
import { Colors, Spacings } from '../../../../theme';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { InputOTP } from '../../../components/Input/InputOTP';
import { Footer } from '../../../components/Footer/Footer';
import { useNavigation } from '@react-navigation/native';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { CONST_SCREEN_HOME, CONST_SCREEN_LOGIN, CONST_SCREEN_VERIFY_MOBILE } from '../../../../constants';
import { getFreeTime, setFreeTime } from '../../../utils/helpers/storage';
import { Body } from '../../../../typography';
import { updateEndpoint } from '../../../utils/helpers/notifications';
import { User } from '../../../models';
// import {sendNotificationToUser, updateEndpoint} from '../../../utils/helpers/notifications';

type Mode = 'signup' | 'login'
export const Signup = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const [mode, setMode] = useState<Mode>('signup')

  const navigation = useNavigation<RootRoutes>();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<CognitoUser | ErrorTypes | null>(null);
  const [trials, setTrials] = useState<number>(0);


  function handleModeChange() {
    setMode(mode === 'signup' ? 'login' : 'signup')
  }

  const handleSignUp = async () => {
    setLoading(true);
    const result = await signUp(number, name);
    if (typeof result === 'string') {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNING_UP_FAILED,
      });
      // TODO: Handle the error appropriately depending on the error type: if the username already exists, then show a message to the user and redirect them to sign in page
    } else {
      NativeModules.RNPushNotification.getToken(
        async (token: string) => {
          await createSignUpUser(number, name, token);
        },
        (error: any) => {
          console.log(error);
        },
      );
      await handleSignIn();
    }
  };

  const handleSignIn = async () => {
    if (!loading) {
      setLoading(true);
    }
    const existingUser = await getUserByPhoneNumber(number);
    if (existingUser && existingUser.is_signed_in) {
      //TODO: Alert the user that they will be signed out of all other devices.
      await globalSignOut();
    }
    if (trials <= 100) {
      const newSession = await signIn(number);
      setTrials(prev => prev + 1);
      if (newSession && newSession instanceof CognitoUser) {
        global_dispatch({
          type: 'SET_AUTH_STATE',
          payload: AuthState.CONFIRMING_OTP,
        });
        global_dispatch({type: 'SET_AUTH_USER', payload: newSession});
      } else {
        //TODO: Handle the error appropriately depending on the error type
      }
      setLoading(false);
    } else {
      setIsLocked(true);
      await setFreeTime(Date.now() + 60 * 60000);
      console.log('You tried more than 2 times, you are blocked for 1 hour');
    }
  };

  const handleSignOut = async () => {
    //TODO: Display appropriate message on the frontend
    const is_signed_out = await signOut();
    if (!is_signed_out) {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNING_OUT_FAILED,
      });
    }
  };

  const handleSubmit = async () => {
      await mode === 'signup' ? handleSignUp(): handleSignIn();
      navigation.navigate(CONST_SCREEN_VERIFY_MOBILE)
  }

  const isValidNumber = useCallback(() => {
    return number.length === 13;
  }, [number]);

  const isValidName = useCallback(() => {
    return name.length > 0;
  }, [name]);

  const page_subheader = 'Check your texts for a confirmation code';

  return (
    <PageLayout header={mode === 'signup' ? 'Sign Up' : 'Log In'} subHeader={page_subheader} onPress={Keyboard.dismiss}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingPage />
        </View>
      ) : (
        <>
        {mode === 'signup' ? <FormField title={'Enter Name'} placeholder={'Jane'} setField={setName} type={'name'} value={name} />
        : null }
        <FormField title={'Phone Number'} placeholder={'Enter your phone'} setField={setNumber} type={'phone'} value={number} />


          <Footer
            buttonDisabled={mode === 'signup' ? !(isValidName() && isValidNumber()) : !isValidNumber()}
            onPress={handleSubmit}
            buttonVariant="secondary"
            buttonText={mode === 'signup' ? "Sign Up" : 'Log In'}>
              <Pressable onPress={handleModeChange}>
                  <Body size='medium' weight='Bold' color={Colors.blue}>
                      Change mode
                      </Body>
                  </Pressable>
          </Footer>

        </>
      )}
    </PageLayout>
  );
};

export default Signup;

// @ts-ignore
const styles = StyleSheet.create({
  formContainer: {
    marginTop: Spacings.s1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
    paddingVertical: Spacings.s3,
  },
  loadingContainer: {
    paddingTop: '60%',
    paddingLeft: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
