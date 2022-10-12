import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useAnimatedStyle, interpolate, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacings } from '../../../theme';
import { Body, Heading } from '../../../typography';
import { FooterType } from '../../utils/types/component.types';
import { Footer } from '../Footer/Footer';
import HamburgerButton from '../HamburgerMenu/HamburgerButton';
import HamburgerIcon from '../HamburgerMenu/HamburgerIcon';

interface PageLayoutProps extends PropsWithChildren {
    style?: any;
    header: string;
    subHeader?: string;
    footer?: FooterType;
    transformContent?: boolean;
    onPress?: () => void;
    backgroundColor?: string;
    showCircle?: boolean;
    hamburger?: boolean;
}

export const PageLayout = (props: PageLayoutProps) => {
    const backgroundStyle = props.backgroundColor || Colors.goldFaded1;
    const navigation = useNavigation();

    const insets = useSafeAreaInsets();

    const footerStyle = StyleSheet.create({
        root: {
            height: 100,
            justifyContent: 'flex-end',
            paddingHorizontal: Spacings.s4,
            // backgroundColor: Colors.red,
            position: 'absolute',
            bottom: insets.bottom,
            left: 0,
            right: 0,
        },
    });


    return (
        <>
            <Pressable onPress={props.onPress} />

            <View style={[styles.root, { backgroundColor: backgroundStyle }]}>
                {props.showCircle ? <View style={[styles.bigSemiCircle]} /> : null}
                <View style={styles.header}>
                    <Heading size="default" weight="Extrabld" color={Colors.black}>
                        {props.header}
                    </Heading>
                    {props.hamburger && <HamburgerButton navigation={navigation} />}
                </View>
                {props.subHeader ? (
                    <View style={styles.subHeader}>
                        <Body size="small" weight="Bold" color={Colors.greyLight2} style={styles.subHeader}>
                            {props.subHeader}
                        </Body>
                    </View>
                ) : null}

                <View style={styles.contentContainer}>{props.children}</View>
                {props.footer ? (
                    <View style={footerStyle.root}>
                        <View>
                            <Footer {...props.footer} />
                        </View>
                    </View>
                ) : null}
            </View>
            {/* </Pressable> */}
        </>
    );
};

const styles = StyleSheet.create({

    root: {
        // paddingHorizontal: Spacings.s2,
        paddingTop: Spacings.s11,
        paddingBottom: Spacings.s9,
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        marginTop: Spacings.s10,
    },
    mainContentContainer: {},
    header: {
        // alignSelf: 'center',
        // alignItems: 'center',
        marginTop: Spacings.s7,
        // zIndex: 2,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    subHeader: {
        alignSelf: 'center',
        marginTop: Spacings.s2,
        textAlign: 'center',
        width: '80%',
        // zIndex: 2,

    },
    bigSemiCircle: {
        position: 'absolute',
        top: -150,
        width: '105%',
        justifyContent: 'center',
        height: '45%',
        borderRadius: 300,
        backgroundColor: Colors.brown,
        overflow: 'hidden',
        // zIndex: 1,
    },
});
