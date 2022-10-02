import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import FormField from '../../../components/FormField';
import {
  getCurrentAuthUser,
  globalSignOut,
  sendChallengeAnswer,
  signIn,
  signOut,
  signUp,
} from '../../../utils/queries/auth';
import {GlobalContext} from '../../../contexts';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState, ErrorTypes} from '../../../utils/enums';
import LoadingPage from '../../CommonScreens/LoadingPage';
import {createSignUpUser, getUserByPhoneNumber, updateAuthState} from '../../../utils/queries/datastore';
import {Spacings} from '../../../../theme';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {InputOTP} from '../../../components/InputComponents/InputOTP';
import {ActionButton} from '../../../components/Buttons/ActionButton';
import {getFreeTime, setFreeTime} from '../../../utils/storage';

const SignUpPage = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [session, setSession] = useState<CognitoUser | ErrorTypes | null>(null);
  const [isPinComplete, setIsPinComplete] = useState<boolean>(false);
  const [trials, setTrials] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const maximumCodeLength = 6;

  useEffect(() => {
    async function unlock() {
      const target = await getFreeTime();
      let remaining_time;
      if (target && (remaining_time = +target - Date.now()) > 1000) {
        setTimeout(() => {
          setIsLocked(false);
        }, remaining_time);
      }
    }
    if (isLocked) {
      unlock().catch(e => console.log(e));
    }
  }, [isLocked]);

  const handleSignUp = async () => {
    setLoading(true);
    const result = await signUp(number, name);
    if (typeof result === 'string') {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNING_UP_FAILED,
      });
      global_dispatch({type: 'SET_AUTH_USER', payload: null});
      setSession(null);
      // TODO: Handle the error appropriately depending on the error type: if the username already exists, then show a message to the user and redirect them to sign in page
    } else {
      global_dispatch({type: 'SET_AUTH_USER', payload: result});
      setSession(result);
    }
    // TODO: Gather the location preference and payment method and pass it here
    await createSignUpUser(number, name, true, 'stripe');
    await handleSignIn();
  };

  const handleSignIn = async () => {
    if (!loading) {
      setLoading(true);
    }
    const existingUser = await getUserByPhoneNumber(number);
    if (existingUser && existingUser.is_signed_in) {
      // TODO: Alert the user that they will be signed out of all other devices.
      await globalSignOut();
    }
    if (trials <= 2) {
      const newSession = await signIn(number);
      setTrials(prev => prev + 1);
      if (newSession && newSession instanceof CognitoUser) {
        setSession(newSession);
        global_dispatch({
          type: 'SET_AUTH_STATE',
          payload: AuthState.CONFIRMING_OTP,
        });
        global_dispatch({type: 'SET_AUTH_USER', payload: newSession});
      } else {
        // TODO: Handle the error appropriately depending on the error type
        setSession(null);
      }
      setHasLoaded(true);
      setLoading(false);
    } else {
      setIsLocked(true);
      await setFreeTime(Date.now() + 60 * 60000);
      console.log('You tried more than 3 times, you are blocked for 1 hour');
    }
  };

  const handleConfirmOTP = async () => {
    setLoading(true);
    const result = await sendChallengeAnswer(otp, session as CognitoUser);
    if (!result) {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.CONFIRMING_OTP_FAILED,
      });
      // TODO: Handle the error appropriately depending on the error type
    } else {
      // TODO: Make sure the number is available and up to date where this query is called.
      const finalUser = await getUserByPhoneNumber(number);
      global_dispatch({
        type: 'SET_CURRENT_USER',
        payload: finalUser,
      });
      await updateAuthState(number, true);
      global_dispatch({type: 'SET_AUTH_USER', payload: result});
    }
    setLoading(false);
  };

  const handleAuth = async () => {
    const auth = await getCurrentAuthUser();
    console.log('user', auth);
  };

  const handleSignOut = async () => {
    // TODO: Display appropriate message on the frontend
    const is_signed_out = await signOut();
    if (is_signed_out) {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNED_OUT,
      });
    } else {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.SIGNING_OUT_FAILED,
      });
    }
  };

  const isValidNumber = useCallback(() => {
    return number.length === 13;
  }, [number]);

  const isValidName = useCallback(() => {
    return name.length > 0;
  }, [name]);

  const page_subheader = hasLoaded
    ? 'Check your texts for a confirmation code'
    : 'Enter your name and phone number to sign up';

  return (
    <PageLayout header="Sign Up" subHeader={page_subheader}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingPage />
        </View>
      ) : (
        <>
          <View style={styles.formContainer}>
            {hasLoaded ? (
              <InputOTP code={otp} setCode={setOtp} maxLength={maximumCodeLength} setIsPinComplete={setIsPinComplete} />
            ) : (
              <>
                <FormField title={'Enter Name'} placeholder={'Jane'} setField={setName} type={'name'} value={name} />
                <FormField title={'Phone Number'} placeholder={''} setField={setNumber} type={'phone'} value={number} />
              </>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <ActionButton
              label="Sign Up"
              onPress={handleSignUp}
              disabled={!(isValidName() && isValidNumber()) || hasLoaded}
            />
            <ActionButton label="OTP" onPress={handleConfirmOTP} disabled={!isPinComplete} />
            <ActionButton label="Sign In" onPress={handleSignIn} />
            <ActionButton label="Auth" onPress={handleAuth} disabled />
            <ActionButton label="Sign Out" onPress={handleSignOut} />
          </View>
        </>
      )}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginTop: Spacings.s10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: '4%',
  },
  loadingContainer: {
    // flex: 1,
    paddingTop: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpPage;
