import { useNavigation } from '@react-navigation/native'
import { CognitoUser } from 'amazon-cognito-identity-js'
import React, { useContext, useEffect, useState } from 'react'
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { CONST_SCREEN_HOME, CONST_SCREEN_LOGIN } from '../../../../constants'
import { Spacings } from '../../../../theme'
import { Body } from '../../../../typography'
import { Footer } from '../../../components/Footer/Footer'
import { InputOTP } from '../../../components/Input/InputOTP'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { GlobalContext } from '../../../contexts'
import { getFreeTime } from '../../../utils/helpers/storage'
import { sendChallengeAnswer } from '../../../utils/queries/auth'
import { ErrorTypes, AuthState } from '../../../utils/types/enums'
import { AuthRoutes } from '../../../utils/types/navigation.types'

export const VerifyMobile = () => {
    const { global_state, global_dispatch } = useContext(GlobalContext);
    const navigation = useNavigation<AuthRoutes>();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<CognitoUser | ErrorTypes | null>(null);
    const [isPinComplete, setIsPinComplete] = useState<boolean>(false);
    const [trials, setTrials] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const maximumCodeLength = 6;

    useEffect(() => {
        let timeoutID: string | number | NodeJS.Timeout | undefined;
        async function unlock() {
            const target = await getFreeTime();
            let remaining_time;
            if (target && (remaining_time = +target - Date.now()) > 1000) {
                timeoutID = setTimeout(() => {
                    setIsLocked(false);
                }, remaining_time);
            }
        }
        if (isLocked) {
            unlock().catch(e => console.log(e));
        }
        return () => {
            if (timeoutID) clearTimeout(timeoutID);
        };
    }, [isLocked]);


    const handleResendOTP = async () => {
        setLoading(true);
        if (trials <= 1) {
            setTrials(prev => prev + 1);
        }
        setOtp('');
        setLoading(false);
    };

    const handleConfirmOTP = async () => {
        setLoading(true);
        const session = global_state.auth_user;
        const result = await sendChallengeAnswer(otp, session as CognitoUser);
        if (!result) {
            global_dispatch({
                type: 'SET_AUTH_STATE',
                payload: AuthState.CONFIRMING_OTP_FAILED,
            });
            //TODO: Handle the error appropriately depending on the error type
        }
        setLoading(false);
        navigation.navigate('Coffee', { screen: CONST_SCREEN_HOME });
    };
    
    return (

        <PageLayout header='Verify Mobile'>

            <View style={styles.root}>
                <View style={styles.otpContainer}>
                    <InputOTP
                        code={otp}
                        setCode={setOtp}
                        maxLength={maximumCodeLength}
                        setIsPinComplete={setIsPinComplete}
                    />
                    <Pressable onPress={handleResendOTP}>
                        {trials > 2 ? (
                            <Body style={styles.otpText} size="small" color={Colors.red}>
                                You have tried more than 3 times, you are blocked for 1 hour.
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
                    buttonDisabled={!isPinComplete || trials > 2}
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
    )
}

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
})