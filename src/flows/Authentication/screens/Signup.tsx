import React, {useCallback, useContext, useState} from 'react';
import {Keyboard, NativeModules, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import FormField from '../../../components/Input/FormField';
import {signUp} from '../../../utils/queries/auth';
import {GlobalContext, SignInContext} from '../../../contexts';
import {AuthState} from '../../../utils/types/enums';
import LoadingPage from '../../CommonScreens/LoadingPage';
import {createSignUpUser} from '../../../utils/queries/datastore';
import {Colors, Spacings} from '../../../../theme';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {Footer} from '../../../components/Footer/Footer';
import {useNavigation} from '@react-navigation/native';
import {RootRoutes} from '../../../utils/types/navigation.types';
import {CONST_SCREEN_VERIFY_MOBILE} from '../../../../constants';
import {Body} from '../../../../typography';
import {setPhone} from '../../../utils/helpers/storage';

type Mode = 'signup' | 'login';
export const Signup = () => {
  const {global_dispatch} = useContext(GlobalContext);
  const {sign_in_dispatch, sendOTP} = useContext(SignInContext);
  const [mode, setMode] = useState<Mode>('signup');
  const navigation = useNavigation<RootRoutes>();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);

  function handleModeChange() {
    setMode(mode === 'signup' ? 'login' : 'signup');
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
    await setPhone(number);
    await sendOTP(number);
    setLoading(false);
  };

  const handleSubmit = async () => {
    mode === 'signup' ? await handleSignUp() : await handleSignIn();
    navigation.navigate(CONST_SCREEN_VERIFY_MOBILE);
  };

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
          {mode === 'signup' ? (
            <FormField title={'Enter Name'} placeholder={'Jane'} setField={setName} type={'name'} value={name} />
          ) : null}
          <FormField
            title={'Phone Number'}
            placeholder={'Enter your phone'}
            setField={(value: React.SetStateAction<string>) => {
              setNumber(value);
              sign_in_dispatch({type: 'SET_PHONE', payload: number});
            }}
            type={'phone'}
            value={number}
          />

          <Footer
            buttonDisabled={mode === 'signup' ? !(isValidName() && isValidNumber()) : !isValidNumber()}
            onPress={handleSubmit}
            buttonVariant="secondary"
            buttonText={mode === 'signup' ? 'Sign Up' : 'Log In'}>
            <Pressable onPress={handleModeChange}>
              <Body size="medium" weight="Bold" color={Colors.blue}>
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
