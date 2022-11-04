import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Keyboard, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import FormField from '../../../components/Input/FormField';
import {sendChallengeAnswer, signUp} from '../../../utils/queries/auth';
import {GlobalContext, SignInContext} from '../../../contexts';
import {AuthState} from '../../../utils/types/enums';
import LoadingPage from '../../CommonScreens/LoadingPage';
import {createSignUpUser} from '../../../utils/queries/datastore';
import {Colors, Spacings} from '../../../../theme';
import {Footer} from '../../../components/Footer/Footer';
import {useNavigation} from '@react-navigation/native';
import {RootRoutes} from '../../../utils/types/navigation.types';
import {CONST_SCREEN_HOME} from '../../../../constants';
import {Body} from '../../../../typography';
import {setFreeTime, setPhone, setTrials} from '../../../utils/helpers/storage';
import {AuthLayout} from '../../../components/Layouts/AuthLayout';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {InputOTP} from '../../../components/Input/InputOTP';
import {Easing, useSharedValue, withTiming} from 'react-native-reanimated';

export type Mode = 'signup' | 'login' | 'verify';

export const AuthPage = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const {sign_in_dispatch, sendOTP, sign_in_state} = useContext(SignInContext);
  const [mode, setMode] = useState<Mode>('signup');
  const navigation = useNavigation<RootRoutes>();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPinComplete, setIsPinComplete] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const maximumCodeLength = 6;
  const planetAnim = useSharedValue(0);
  const asteroidAnim = useSharedValue(0);
  const asteroidAnimFinal = useSharedValue(0);
  const planetAnimFinal = useSharedValue(0);

  function handleModeChange() {
    if (mode === 'signup') {
      setMode('login');
    }
    if (mode === 'login') {
      setMode('signup');
    }
    if (mode === 'verify') {
      setMode('signup');
      planetAnim.value = withTiming(0, {duration: 1000});
      asteroidAnim.value = withTiming(0, {duration: 1000});
      asteroidAnimFinal.value = withTiming(0, {duration: 1000});
    }
  }

  useEffect(() => {
    let timeoutID: string | number | NodeJS.Timeout | undefined;
    async function unlock() {
      let remaining_time;
      if ((remaining_time = sign_in_state.blocked_time - Date.now()) > 1000) {
        timeoutID = setTimeout(async () => {
          setIsLocked(false);
          sign_in_dispatch({type: 'SET_BLOCKED_TIME', payload: 0});
          sign_in_dispatch({type: 'SET_TRIALS', payload: 0});
          await setFreeTime(0);
          await setTrials(0);
        }, remaining_time);
      }
    }
    if (isLocked) {
      unlock().catch(e => console.log(e));
    }
    return () => {
      if (timeoutID) clearTimeout(timeoutID);
    };
  }, [isLocked, sign_in_dispatch, sign_in_state.blocked_time]);

  const handleResendOTP = async () => {
    setLoading(true);
    await sendOTP(sign_in_state.phone_number);
    setOtp('');
    setLoading(false);
  };

  const handleConfirmOTP = async () => {
    setLoading(true);
    // asteroidAnimFinal.value = withTiming(1, { duration: 5000 });
    // planetAnimFinal.value = withTiming(1, { duration: 5000 });

    const session = sign_in_state.session;
    const result = await sendChallengeAnswer(otp, session as CognitoUser);
    if (!result) {
      global_dispatch({
        type: 'SET_AUTH_STATE',
        payload: AuthState.CONFIRMING_OTP_FAILED,
      });
    }
    //TODO: Handle the error appropriately depending on the error type
    setLoading(false);
    navigation.navigate('Coffee', {screen: CONST_SCREEN_HOME});
  };

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
      await createSignUpUser(number, name, global_state.device_token);
      await handleSignIn();
    }
  };

  const handleSignIn = async () => {
    if (!loading) {
      setLoading(true);
    }
    await setPhone(number);
    await sendOTP(number);
    setMode('verify');
    setLoading(false);
    planetAnim.value === 0 && mode !== 'verify'
      ? (planetAnim.value = withTiming(1, {duration: 1000}))
      : (planetAnim.value = withTiming(0, {duration: 1000}));
    asteroidAnim.value === 0 && mode !== 'verify'
      ? (asteroidAnim.value = withTiming(1, {
          duration: 900,
          easing: Easing.bezier(0.32, 0, 0.39, 0),
        }))
      : (asteroidAnim.value = withTiming(0, {
          duration: 900,
          easing: Easing.bezier(0.22, 0, 0.39, 0),
        }));
  };

  const handleSubmit = async () => {
    mode === 'signup' ? await handleSignUp() : mode === 'login' ? await handleSignIn() : await handleConfirmOTP();
  };

  const isValidNumber = useCallback(() => {
    return number.length === 13;
  }, [number]);

  const isValidName = useCallback(() => {
    return name.length > 0;
  }, [name]);

  const signup_subheader = 'Sign up with your name and phone number.';
  const login_subheader = 'Enter your phone number to sign in.';

  return (
    <AuthLayout
      planetAnim={planetAnim}
      asteroidAnim={asteroidAnim}
      asteroidAnimFinal={asteroidAnimFinal}
      mode={mode}
      subHeader={mode === 'signup' ? signup_subheader : login_subheader}
      onPress={() => Keyboard.dismiss()}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingPage />
        </View>
      ) : (
        <>
          {mode === 'signup' ? (
            <View style={styles.formContainerName}>
              <FormField title="" placeholder={'Enter name...'} setField={setName} type={'name'} value={name} />
            </View>
          ) : null}
          {mode === 'signup' || mode === 'login' ? (
            <View style={styles.formContainerPhone}>
              <FormField
                title=""
                placeholder={'Enter phone number...'}
                setField={(value: React.SetStateAction<string>) => {
                  setNumber(value);
                  sign_in_dispatch({type: 'SET_PHONE', payload: number});
                }}
                type={'phone'}
                value={number}
              />
            </View>
          ) : null}

          {mode === 'verify' ? (
            <View style={styles.otpContainer}>
              <InputOTP code={otp} setCode={setOtp} maxLength={maximumCodeLength} setIsPinComplete={setIsPinComplete} />
              <Pressable onPress={handleResendOTP}>
                {isLocked ? (
                  <Body style={styles.otpText} size="small" color={Colors.red}>
                    You have tried more than 2 times, you are blocked for 1 hour.
                  </Body>
                ) : (
                  <Body style={styles.otpText} size="small" color={Colors.blue}>
                    Didn't receive a code? Resend code
                  </Body>
                )}
              </Pressable>
            </View>
          ) : null}

          <Footer
            buttonDisabled={
              mode === 'signup'
                ? !(isValidName() && isValidNumber())
                : mode === 'login'
                ? !isValidNumber()
                : !isPinComplete || isLocked
            }
            onPress={handleSubmit}
            buttonVariant="secondary"
            buttonText={mode === 'signup' ? 'Sign Up' : mode === 'login' ? 'Log In' : 'Confirm OTP'}>
            <Pressable onPress={handleModeChange}>
              <Body size="medium" weight="Bold" color={Colors.blue}>
                Change mode
              </Body>
            </Pressable>
          </Footer>
        </>
      )}
    </AuthLayout>
  );
};

export default AuthPage;

// @ts-ignore
const styles = StyleSheet.create({
  formContainerPhone: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
  },
  formContainerName: {
    position: 'absolute',
    bottom: 200,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
    paddingVertical: Spacings.s3,
  },
  loadingContainer: {
    paddingTop: '10%',
    paddingLeft: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    marginBottom: Spacings.s2,
    alignItems: 'center',
  },
  otpText: {
    marginTop: Spacings.s8,
  },
});
