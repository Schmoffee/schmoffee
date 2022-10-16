import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";


const { height: wHeight, width: wWidth } = Dimensions.get("window");


export const HEADER_IMAGE_HEIGHT = wHeight / 3;

interface HeaderImageProps {
    y: Animated.SharedValue<number>;
    source: any;
}

export const HeaderImage = (props: HeaderImageProps) => {
    const rImageStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(props.y.value, [-100, 30], [HEADER_IMAGE_HEIGHT + 10, HEADER_IMAGE_HEIGHT], Extrapolate.CLAMP),
            top: interpolate(props.y.value, [0, 80], [0, -80], Extrapolate.CLAMP),
        };
    });
    return (
        <Animated.Image
            source={props.source}
            style={[styles.image, rImageStyle]}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        position: "absolute",
        width: wWidth,
        resizeMode: "cover",
        marginTop: 50,
    },
});
