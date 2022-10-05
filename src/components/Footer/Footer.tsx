import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { FooterType } from '../../utils/types/component.types';
import { ActionButton } from '../Buttons/ActionButton';

export const Footer = (props: FooterType) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
        console.log('keyboard visible');
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
        console.log('keyboard hidden');
    });
    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={210}>
            {/* <View style={styles.root}> */}
            {props.hide ? null : (
                <View>
                    {props.children ? <View style={styles.childrenContainer}>{props.children}</View> : null}
                    <ActionButton
                        label={props.buttonText ? props.buttonText : 'Continue'}
                        disabled={props.buttonDisabled}
                        onPress={() => props.onPress()}
                        variant={props.buttonVariant ? props.buttonVariant : 'primary'}
                    />
                </View>
            )}
            {/* </View> */}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        // paddingHorizontal: Spacings.s4,
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: Spacings.s3,
    },

    childrenContainer: {
        alignSelf: 'center',

    },
});
