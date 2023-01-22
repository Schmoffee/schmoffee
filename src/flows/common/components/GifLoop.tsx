import React, { useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

interface GifLoopProps {
    source: string
}

const GifLoop = (props: GifLoopProps) => {
    const animationRef = useRef(new Animated.Value(0)).current;

    const startAnimation = () => {
        animationRef.setValue(0);
        Animated.timing(animationRef, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start(() => startAnimation());
    };

    startAnimation();

    const gifOpacity = animationRef.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0]
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.container]}>
                <Image style={styles.gif} source={require('../../../assets/gifs/tumbleweed.gif')} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: 300,
        // backgroundColor: 'red',
    },
    gif: {
        height: 80,
        width: 280,
    }

});

export default GifLoop;
