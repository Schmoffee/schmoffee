import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body, Heading } from '../../../typography';
import { FooterType } from '../../utils/types/component.types';
import { Footer } from '../Footer/Footer';

interface PageLayoutProps extends PropsWithChildren {
    header: string;
    subHeader?: string;
    footer?: FooterType;
    transformContent?: boolean;
    onPress?: () => void;
}

export const PageLayout = (props: PageLayoutProps) => {
    return (
        <Pressable onPress={props.onPress}>
            <View style={styles.root}>
                <Pressable onPress={() => { }}></Pressable>
                <View style={styles.header}>
                    <Heading size="default" weight="Extrabld" color={Colors.black}>
                        {props.header}
                    </Heading>
                </View>
                <View style={styles.subHeader}>
                    <Body size="small" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                        {props.subHeader}
                    </Body>
                </View>
                <View style={styles.contentContainer}>{props.children}</View>
                {props.footer ? (
                    <View style={styles.footerContainer}>
                        <View>
                            <Footer {...props.footer} />
                        </View>
                    </View>
                ) : null}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: Spacings.s4,
        paddingTop: Spacings.s11,
        paddingBottom: Spacings.s9,
        height: '100%',
        backgroundColor: Colors.goldFaded4,
    },
    contentContainer: {
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        flex: 1,
        marginTop: Spacings.s10,
    },
    mainContentContainer: {
        // flex: 1,
    },
    header: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: Spacings.s7,
    },
    subHeader: {
        alignSelf: 'center',
        marginTop: Spacings.s2,
        textAlign: 'center',
        width: '80%',
    },
    footerContainer: {
        position: 'absolute',
        bottom: Spacings.s12,
        left: Spacings.s4,
        right: Spacings.s4,
    },
});
