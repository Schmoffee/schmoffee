import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { CONST_SCREEN_SETTINGS, CONST_SCREEN_UPDATE_PROFILE, CONST_SCREEN_CHANGE_PAYMENT, CONST_SCREEN_LOGIN } from '../../../constants'
import { Colors, Spacings } from '../../../theme'
import { Heading, Body } from '../../../typography'
import { RootRoutes } from '../../utils/types/navigation.types'

interface SideDrawerContentProps {
    anim: Animated.SharedValue<number>
}

export const SideDrawerContent = ({ anim }: SideDrawerContentProps) => {
    const navigation = useNavigation<RootRoutes>()
    const HOME_WIDTH = useWindowDimensions().width;


    const handleLogOut = async () => {
        navigation.navigate(CONST_SCREEN_LOGIN);
        // await signOut();
    };

    const rSideDrawerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: anim.value - HOME_WIDTH }, {
                skewY: anim.value > 195 ? `-${195 / 2000}rad` : `-${anim.value / 2000}rad`
            }],
            opacity: anim.value / HOME_WIDTH * 10,


        };
    });

    return (
        <Animated.View style={[styles.sideDrawer, rSideDrawerStyle]}>
            <View>
                <View style={styles.sideDrawerContent}>
                    <Heading size="default" weight="Extrabld">
                        Hi, Meyad!
                    </Heading>
                    <TouchableOpacity onPress={() => navigation.navigate('SideDrawer', { screen: CONST_SCREEN_SETTINGS })}>
                        <View style={styles.sideDrawerButton}>
                            <Body size="medium" weight="Bold">
                                Settings
                            </Body>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SideDrawer', { screen: CONST_SCREEN_UPDATE_PROFILE })}>
                        <View style={styles.sideDrawerButton}>
                            <Body size="medium" weight="Bold">
                                Update profile
                            </Body>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SideDrawer', { screen: CONST_SCREEN_CHANGE_PAYMENT })}>
                        <View style={styles.sideDrawerButton}>
                            <Body size="medium" weight="Bold">
                                Change payment
                            </Body>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogOut}>
                        <View style={styles.logOut}>
                            <Body size="medium" weight="Extrabld">
                                Log Out
                            </Body>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    sideDrawer: {
        position: 'absolute',
        top: Spacings.s2,
        bottom: 0,
        right: 0,
        width: '50%',
        backgroundColor: Colors.greyLight1,
    },
    sideDrawerContent: {
        padding: Spacings.s5,
        height: '100%',
        marginVertical: Spacings.s8,
    },
    sideDrawerButton: {
        borderColor: Colors.gold,
        borderWidth: 3,
        padding: Spacings.s2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacings.s12,
    },
    logOut: {
        // backgroundColor: 'red',
        padding: 10,
        marginTop: Spacings.s8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
