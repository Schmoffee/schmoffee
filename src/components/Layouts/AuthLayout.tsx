import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Animated, { FadeOutLeft, FadeInRight, FadeInDown, FadeOut, FadeInLeft, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Colors, Spacings } from '../../../theme';
import { Body, Heading } from '../../../typography';
import { Mode } from '../../flows/Authentication/screens/AuthPage';
import { FooterType } from '../../utils/types/component.types';
import { Footer } from '../Footer/Footer';
import HamburgerIcon from '../HamburgerMenu/HamburgerIcon';
import { BlurView } from '@react-native-community/blur';

interface AuthLayoutProps extends PropsWithChildren {
    style?: any;
    headerChildren?: React.ReactNode;
    subHeader: string;
    footer?: FooterType;
    transformContent?: boolean;
    onPress?: () => void;
    backgroundColor?: string;
    showCircle?: boolean;
    hamburger?: boolean;
    hamburgerOnPress?: () => void;
    mode: Mode
}

export const AuthLayout = (props: AuthLayoutProps) => {
    const backgroundStyle = props.backgroundColor || Colors.white;
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>
            <Pressable onPress={props.onPress} />
            <View style={[styles.root, { backgroundColor: backgroundStyle }]}>
                <Animated.Image source={require('../../assets/pngs/planet.png')} style={[styles.planet]} />
                <Animated.Image source={require('../../assets/pngs/asteroid.png')} style={[styles.asteroid]} />
                <View
                    style={[styles.headingContainer]}>
                    <View style={styles.header}>
                        {props.hamburger ? (
                            <TouchableOpacity onPress={props.hamburgerOnPress}>
                                <View style={styles.hamburgerButton}>
                                    <HamburgerIcon />
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        {props.mode === 'login' && (
                            <>
                                <Animated.View
                                    entering={FadeInRight.damping(1000).duration(1000)}
                                    exiting={FadeOutLeft.damping(500).duration(700)}>
                                    <Heading size="large" weight="Bold" color={Colors.black}>
                                        Login
                                    </Heading>
                                </Animated.View>

                                <Animated.View
                                    entering={FadeInLeft.damping(1000).duration(1000)}
                                    exiting={FadeOut.damping(1000)}
                                    style={styles.subHeader}>
                                    <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                                        {props.subHeader}
                                    </Body>
                                </Animated.View>
                            </>

                        )}

                        {props.mode === 'signup' && (
                            <>
                                <Animated.View
                                    entering={FadeInRight.damping(1000).duration(1000)}
                                    exiting={FadeOutLeft.damping(1000).duration(700)}>
                                    <Heading size="large" weight="Bold" color={Colors.black}>
                                        Sign up
                                    </Heading>
                                </Animated.View>

                                <Animated.View
                                    entering={FadeInLeft.damping(1000).duration(1000)}
                                    exiting={FadeOut.damping(1000)}
                                    style={styles.subHeader}>
                                    <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                                        {props.subHeader}
                                    </Body>
                                </Animated.View>
                            </>

                        )}
                    </View>
                </View>

                {isKeyboardVisible ? (
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        style={styles.blurView}>
                        <BlurView style={styles.absolute} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="white" />
                    </Animated.View>
                ) : null}

                <View style={styles.contentContainer}>{props.children}</View>
                {props.footer ? (
                    <View>
                        <Footer {...props.footer} />
                    </View>
                ) : null}
            </View>
            {/* </Pressable> */}
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({

    root: {
        paddingTop: Spacings.s11,
        paddingBottom: Spacings.s9,
        height: '100%',
    },
    contentContainer: {
        flex: 1,
    },
    planet: {
        position: 'absolute',
        top: 50,
        right: 0,
        zIndex: -1,
    },
    asteroid: {
        position: 'absolute',
        top: -80,
        left: -400,
        zIndex: -1,
        transform: [{ scale: 0.2 }, { rotate: '-80deg' }],
        // backgroundColor: Colors.red,
    },
    headingContainer: {
        paddingHorizontal: Spacings.s6,
        marginVertical: Spacings.s7,
    },
    header: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: Spacings.s7,
        flexDirection: 'column',
    },
    subHeader: {
        alignSelf: 'flex-start',
        marginTop: Spacings.s1,
        textAlign: 'left',
        width: '60%',
    },
    childrenContainer: {
        marginBottom: Spacings.s4,
    },
    absolute: {
        position: 'absolute',
        top: '10%',
        left: 0,
        bottom: '30%',
        right: 0,
        height: 20000
    },
    blurView: {
        position: 'absolute',
        top: '10%',
        left: 0,
        bottom: '1%',
        right: 0,
        height: '1%',
    },
});
