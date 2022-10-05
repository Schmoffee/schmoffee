import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import FormField from '../../../components/FormField';
import { Colors, Spacings } from '../../../../theme';
import { Body } from '../../../../typography';
import { ActionButton } from '../../../components/Buttons/ActionButton';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { useNavigation } from '@react-navigation/native';
import { CONST_SCREEN_HOME, CONST_SCREEN_SIGNUP } from '../../../../constants';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { Footer } from '../../../components/Footer/Footer';
import LoadingPage from '../../CommonScreens/LoadingPage';
import { InputOTP } from '../../../components/InputComponents/InputOTP';

interface LoginProps { }

export const Login = (props: LoginProps) => {
    const navigation = useNavigation<RootRoutes>();
    const [number, setNumber] = useState('');
    const [isPinComplete, setIsPinComplete] = useState(false);
    const [otp, setOtp] = useState('');
    const maximumCodeLength = 6;

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
                                <InputOTP
                                    code={otp}
                                    setCode={setOtp}
                                    maxLength={maximumCodeLength}
                                    setIsPinComplete={setIsPinComplete}
                                />
                            ) : (
                                <FormField title={'Phone Number'} placeholder={''} setField={setNumber} type={'phone'} value={number} />
                            )}
                        </View>
                        {/* <View style={styles.buttonContainer}> */}
                        {hasLoaded ? (
                            <Footer
                                buttonDisabled={!isPinComplete}
                                onPress={handleLogIn}
                                buttonText="Confirm OTP">
                                <TouchableOpacity onPress={() => navigation.navigate(CONST_SCREEN_SIGNUP)}>
                                    <Body size="medium" weight="Bold" color={Colors.blue}>
                                        Don't have an account? Sign up
                                    </Body>
                                </TouchableOpacity>
                            </Footer>
                        ) : (
                            <Footer buttonVariant='primary' buttonDisabled={!isValidNumber()} onPress={() => setHasLoaded(true)} buttonText="Log in">
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

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        // marginTop: Spacings.s20,
        height: '100%',
    },
    formContainer: {
        marginBottom: '70%',
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
