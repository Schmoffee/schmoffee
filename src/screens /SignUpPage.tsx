import React, {useContext, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormField from '../components/FormField';
import {
  getCurrentAuthUser,
  globalSignOut,
  sendChallengeAnswer,
  signIn,
  signOut,
  signUp,
} from '../utils/queries/auth';
import {GlobalContext} from '../contexts';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState, ErrorTypes} from '../utils/enums';
import LoadingPage from './LoadingPage';
import {
  createSignUpUser,
  getUserByPhoneNumber,
  updateAuthState,
} from '../utils/queries/datastore';
import {User} from '../models';

const SignUpPage = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<CognitoUser | ErrorTypes | null>(null);

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
    const newSession = await signIn(number);
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
    setLoading(false);
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

  return (
    <View style={styles.wrapper} testID={'sign_up_page'}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Text>Sign Up</Text>
          <View style={styles.formContainer}>
            <FormField
              style={[styles.subNameContainer, styles.subNameContainerLeft]}
              title={'OTP'}
              placeholder={'Enter OTP'}
              setField={setOtp}
              type={'number'}
              value={otp}
            />
            <View style={styles.namesContainer}>
              <FormField
                title={'Phone Number'}
                placeholder={''}
                setField={setNumber}
                type={'number'}
                value={number}
                style={undefined}
              />
              <FormField
                style={[styles.subNameContainer, styles.subNameContainerLeft]}
                title={'Name'}
                placeholder={'Jane'}
                setField={setName}
                type={'name'}
                value={name}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSignUp}>
              <Text>signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirmOTP}>
              <Text>OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAuth}>
              <Text>Auth</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignIn}>
              <Text>Signin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}>
              <Text>Signout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#EDEBE7',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
  },
  formContainer: {
    flex: 1,
    paddingTop: '5%',
  },

  namesContainer: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: '2%',
  },
  subNameContainer: {
    flex: 1,
  },
  subNameContainerLeft: {
    marginRight: '5%',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '4%',
  },
  hyperlink: {
    marginVertical: '2%',
    textDecorationLine: 'underline',
    textAlignVertical: 'bottom',
  },
});

export default SignUpPage;
