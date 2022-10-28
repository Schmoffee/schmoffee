import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import FormField from '../../../components/Input/FormField';
import { Colors, Spacings } from '../../../../theme';
import { Body } from '../../../../typography';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { useNavigation } from '@react-navigation/native';
import { CONST_SCREEN_HOME, CONST_SCREEN_SIGNUP } from '../../../../constants';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { Footer } from '../../../components/Footer/Footer';
import LoadingPage from '../../CommonScreens/LoadingPage';
import { signIn } from '../../../utils/queries/auth';
import { InputOTP } from '../../../components/Input/InputOTP';

interface LoginProps { }

export const Login = (props: LoginProps) => {
  const navigation = useNavigation<RootRoutes>();
  const [number, setNumber] = useState('');
  const [isPinComplete, setIsPinComplete] = useState(false);
  const [otp, setOtp] = useState('');
  const maximumCodeLength = 6;

  const [trials, setTrials] = useState<number>(0);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidNumber = useCallback(() => {
    return number.length === 13;
  }, [number]);

  const handleLogIn = () => {
    navigation.navigate('Coffee', { screen: CONST_SCREEN_HOME });
    setLoading(false);
    setIsPinComplete(false);
    setOtp('');
    setHasLoaded(false);
    setNumber('');
  };

  const handleResendOTP = async () => {
    setLoading(true);
    if (trials <= 2) {
      setTrials(prev => prev + 1);
    }
    setOtp('');
    setLoading(false);
  };


  return (
    <PageLayout header="Log in" subHeader="Enter your phone number to log in" onPress={Keyboard.dismiss}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingPage />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.formContainer}>
              {hasLoaded ? (
                <View style={styles.otpContainer}>
                  <InputOTP
                    code={otp}
                    setCode={setOtp}
                    maxLength={maximumCodeLength}
                    setIsPinComplete={setIsPinComplete}
                  />
                  <Pressable onPress={handleResendOTP}>
                    {trials > 2 ? (
                      <Body style={styles.otpText} size='small' color={Colors.red}>You have tried more than 3 times, you are blocked for 1 hour.</Body>
                    ) : (
                      <Body style={styles.otpText} size='small' color={Colors.blue}>Didn't receive a code? Resend code</Body>
                    )}
                  </Pressable>
                </View>
              ) : (
                <FormField title={'Phone Number'} placeholder={''} setField={setNumber} type={'phone'} value={number} />
              )}
            </View>
            {/* <View style={styles.buttonContainer}> */}
            {hasLoaded ? (
              <Footer
                buttonDisabled={!isPinComplete || trials > 2}
                onPress={handleLogIn}
                buttonText="Confirm OTP"
                buttonVariant="secondary">
                <TouchableOpacity onPress={() => navigation.navigate(CONST_SCREEN_SIGNUP)}>
                  <Body size="medium" weight="Bold" color={Colors.blue}>
                    Don't have an account? Sign up
                  </Body>
                </TouchableOpacity>
              </Footer>
            ) : (
              <Footer
                buttonVariant="secondary"
                buttonDisabled={!isValidNumber()}
                onPress={async () => {
                  const newSession = await signIn(number);
                  console.log(newSession);
                  if (newSession) {
                    setHasLoaded(true);
                  }
                }}
                buttonText="Log in">
                <TouchableOpacity onPress={() => navigation.navigate(CONST_SCREEN_SIGNUP)}>
                  <Body size="medium" weight="Bold" color={Colors.blue}>
                    Don't have an account? Sign up
                  </Body>
                </TouchableOpacity>
              </Footer>
            )}
          </View>
          {/* </View> */}
        </>
      )}
    </PageLayout>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // marginTop: Spacings.s20,
    height: '100%',
  },
  formContainer: {
    marginBottom: '70%',
  },
  otpContainer: {
    marginTop: Spacings.s1,
    alignItems: 'center',
  },
  otpText: {
    marginTop: Spacings.s8,
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
