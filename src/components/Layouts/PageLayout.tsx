import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body, Heading } from '../../../typography';

interface PageLayoutProps extends PropsWithChildren {
    header: string;
    subHeader?: string;
    footer?: boolean;
    transformContent?: boolean;
}

export const PageLayout = (props: PageLayoutProps) => {
    // const navigation = useNavigation()
    return (
        <View style={styles.root}>
            <Pressable onPress={() => { }}>
            </Pressable>
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
                    <View style={styles.footerButton}>
                        <Body size="small" weight="Bold" color={Colors.greenDark1}>
                            Save
                        </Body>
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: Spacings.s4,
        paddingTop: Spacings.s11,
        paddingBottom: Spacings.s9,
        height: '100%',
    },
    contentContainer: {
        justifyContent: 'flex-start',
    },
    mainContentContainer: {
        flex: 1,
    },
    header: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: Spacings.s2,
    },
    subHeader: {
        alignSelf: 'center',
        // flex: 1,
        alignItems: 'center',
        marginTop: Spacings.s2,
        textAlign: 'center',
        width: '80%',
    },
    footerContainer: {
        position: 'absolute',
        bottom: Spacings.s10,
        left: Spacings.s4,
        right: Spacings.s4,
    },
    footerButton: {
        backgroundColor: Colors.greenDark1,
        borderRadius: 8,
        paddingVertical: Spacings.s3,
        alignItems: 'center',
    },
});
