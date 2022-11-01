import {useNavigation} from '@react-navigation/native';
import {CognitoUser} from 'amazon-cognito-identity-js';
import React, {useContext, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Spacings} from '../../../../theme';
import {Body} from '../../../../typography';
import {Footer} from '../../../components/Footer/Footer';
import {InputOTP} from '../../../components/Input/InputOTP';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {GlobalContext, SignInContext} from '../../../contexts';
import {setFreeTime, setTrials} from '../../../utils/helpers/storage';
import {sendChallengeAnswer} from '../../../utils/queries/auth';
import {AuthState} from '../../../utils/types/enums';
import {AuthRoutes} from '../../../utils/types/navigation.types';
import {getUserByPhoneNumber, updateDeviceToken} from '../../../utils/queries/datastore';

export const VerifyMobile = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const {sendOTP, sign_in_state, sign_in_dispatch} = useContext(SignInContext);
  const navigation = useNavigation<AuthRoutes>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPinComplete, setIsPinComplete] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const maximumCodeLength = 6;

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
  };

  return (
    <PageLayout header="Verify Mobile">
      <View style={styles.root}>
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

        <Footer
          buttonVariant="secondary"
          buttonDisabled={!isPinComplete || isLocked}
          onPress={handleConfirmOTP}
          buttonText="Confirm OTP">
          {/* <TouchableOpacity onPress={ }>
                        <Body size="medium" weight="Bold" color={Colors.blue}>
                            Already have an account? Sign in
                        </Body>
                    </TouchableOpacity> */}
        </Footer>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.s5,
  },

  otpContainer: {
    marginTop: Spacings.s1,
    alignItems: 'center',
  },
  otpText: {
    marginTop: Spacings.s8,
  },
});
