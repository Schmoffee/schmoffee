import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated, TouchableOpacity } from 'react-native';
import { useAnimatedStyle, interpolate, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacings } from '../../../theme';
import { Body, Heading } from '../../../typography';
import { FooterType } from '../../utils/types/component.types';
import { Footer } from '../Footer/Footer';
import HamburgerButton from '../HamburgerMenu/HamburgerButton';
import HamburgerIcon from '../HamburgerMenu/HamburgerIcon';
import { MotiView } from 'moti';

interface AuthLayoutProps extends PropsWithChildren {
    style?: any;
    header: string;
    headerChildren?: React.ReactNode;
    subHeader?: string;
    footer?: FooterType;
    transformContent?: boolean;
    onPress?: () => void;
    backgroundColor?: string;
    showCircle?: boolean;
    hamburger?: boolean;
    hamburgerOnPress?: () => void;
}

export const AuthLayout = (props: AuthLayoutProps) => {
    const backgroundStyle = props.backgroundColor || Colors.white;
    const navigation = useNavigation();
    return (
        <>
            <Pressable onPress={props.onPress} />
            <View style={[styles.root, { backgroundColor: backgroundStyle }]}>
                {props.showCircle ? <View style={[styles.bigSemiCircle]} /> : null}
                <View style={styles.headingContainer}>
                    <View style={styles.header}>
                        {props.hamburger ? (
                            <TouchableOpacity onPress={props.hamburgerOnPress}>
                                <View style={styles.hamburgerButton}>
                                    <HamburgerIcon />
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        <Heading size="large" weight="Bold" color={Colors.black}>
                            {props.header}
                        </Heading>
                        <View style={styles.headerChildren}>{props.headerChildren}</View>
                    </View>
                    {props.subHeader ? (
                        <View style={styles.subHeader}>
                            <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                                {props.subHeader}
                            </Body>
                        </View>
                    ) : null}
                </View>

                <View style={styles.contentContainer}>{props.children}</View>
                {props.footer ? (
                    <View>
                        <Footer {...props.footer} />
                    </View>
                ) : null}
            </View>
            {/* </Pressable> */}
        </>
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
        // marginTop: Spacings.s10,
    },
    mainContentContainer: {},
    headingContainer: {
        paddingHorizontal: Spacings.s6,
        marginVertical: Spacings.s7,

    },
    header: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: Spacings.s7,
        flexDirection: 'row',

    },
    headerChildren: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        // marginBottom: Spacings.s10,
    },
    hamburgerButton: {
        justifyContent: 'center',
        position: 'absolute',
        left: -100,
        top: -14,
    },
    subHeader: {
        alignSelf: 'flex-start',
        marginTop: Spacings.s1,
        textAlign: 'left',
        width: '60%',

        // zIndex: 2,
    },
    bigSemiCircle: {
        position: 'absolute',
        top: -150,
        width: '105%',
        justifyContent: 'center',
        height: '45%',
        borderRadius: 300,
        backgroundColor: Colors.darkBlue,
        overflow: 'hidden',
        // zIndex: 1,
    },
    childrenContainer: {
        marginBottom: Spacings.s4,
    },
});
