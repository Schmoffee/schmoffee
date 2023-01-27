import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacings } from '../../theme';

interface HoverButtonProps {
    onShortPressOut: () => void;
    onLongPress: () => void;
}

const HoverButton = (props: HoverButtonProps) => {
    const [pressed, setPressed] = useState(false)
    const [longPressed, setLongPressed] = useState(false);
    const anim = useSharedValue(1);


    const handlePressIn = () => {
        setPressed(true);
        anim.value = withTiming(0.90, {
            duration: 100,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
    };
    const handleLongPress = () => {
        setLongPressed(true);
        // wait for animation to finish

        anim.value = withTiming(1.05, {
            duration: 5000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
        props.onLongPress();
    };

    const handlePressOut = () => {
        setPressed(false);

        if (longPressed) {
            setLongPressed(false);
            anim.value = withTiming(1, {
                duration: 50,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });

        }
        else {
            anim.value = withTiming(1, {
                duration: 50,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            props.onShortPressOut();
        }
    };


    const rButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        anim.value,
                        [0, 1],
                        [0, 1],
                    ),

                },
                {
                    translateY: interpolate(
                        anim.value,
                        [0, 1],
                        [-15, 0],
                    ),

                },
                {
                    translateX: interpolate(
                        anim.value,
                        [0, 1],
                        [20, 0],
                    ),
                }
            ],

            elevation: 0,

        };
    });



    return (
        <View style={styles.root}>
            <Animated.View style={[rButtonStyle, styles.button2]}>
                <Pressable
                    onPressIn={() => {
                        handlePressIn();
                    }}
                    onLongPress={() => {
                        handleLongPress();
                    }}
                    onPressOut={() => handlePressOut()}
                    delayLongPress={300}

                    style={[
                        styles.button,
                        pressed ? styles.buttonPressed : null
                    ]}
                >
                    {/* {pressed ?
                        <View style={styles.buttonText}>
                            <Text>USUAL</Text>
                        </View>
                        :
                        <View style={styles.buttonText}>
                            <Text>GO</Text>
                        </View>
                    } */}
                </Pressable>
            </Animated.View>
            <Image style={styles.image} source={require('../../../../assets/pngs/button-blue.png')} />

        </View>

    );
};


const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: Colors.blue,
        padding: 16,
        width: 70,
        height: 70,
        borderRadius: 35,
        elevation: 4,
        marginTop: -40,
        marginLeft: 52,
    },
    buttonPressed: {
        elevation: 0,
        zIndex: 0,
        backgroundColor: Colors.blue,
    },
    buttonText: {
        textAlign: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '130%',
        paddingRight: Spacings.s2,
        color: '#333',
    },
    button2: {
        position: 'absolute',
        zIndex: 1,
    },
    image: {
        width: 150,
        height: 150,
        marginLeft: 50,
        marginTop: 10,
    }
});


export default HoverButton;

