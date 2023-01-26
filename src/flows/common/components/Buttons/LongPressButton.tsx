import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface HoverButtonProps {
    onPress: () => void;
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
        if (pressed) {
            setPressed(false);
            anim.value = withTiming(1, {
                duration: 50,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            props.onPress();
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
            ],
            shadowOffset: {
                width: 0,
                height: 0,
            },
            // shadowOpacity: interpolate(anim.value, [0, 1], [0, 1]),
            shadowRadius: anim.value * 2,
            elevation: 0,

        };
    });



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={[rButtonStyle, styles.button2]}>
                <Pressable
                    onPressIn={() => {
                        handlePressIn();
                    }}
                    onLongPress={() => {
                        handleLongPress();
                    }}
                    onPressOut={() => handlePressOut()}
                    delayLongPress={400}

                    style={[
                        styles.button,
                        pressed ? styles.buttonPressed : null
                    ]}
                >
                    {/* <View style={styles.buttonText}>
                    <Text>Button</Text>
                </View> */}
                </Pressable>
            </Animated.View>
            <Image source={require('../../../../assets/pngs/button-blue.png')} />

        </View>

    );
};


const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 16,
        width: 70,
        height: 70,
        borderRadius: 35,
        // borderRadius: 4,
        elevation: 4,
        marginTop: -60,
        marginLeft: 1,
        // zIndex: 1,
    },
    buttonPressed: {
        elevation: 0,
        zIndex: 0,
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button2: {
        position: 'absolute',
        // flex: 1,


        zIndex: 1,
    },
});


export default HoverButton;

