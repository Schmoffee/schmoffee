import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Colors } from "../../../theme";
import { Heading } from "../../../typography";


const { height: wHeight, width: wWidth } = Dimensions.get("window");


export const HEADER_IMAGE_HEIGHT = wHeight / 4;

interface ShopHeaderProps {
    y: Animated.SharedValue<number>;
    source: any;
}

export const ShopHeader = (props: ShopHeaderProps) => {
    const rImageStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(props.y.value, [80, 0], [HEADER_IMAGE_HEIGHT - 70, HEADER_IMAGE_HEIGHT], Extrapolate.CLAMP),
            top: interpolate(props.y.value, [0, 80], [-50, -80], Extrapolate.CLAMP),
            // opacity: interpolate(props.y.value, [0, 80], [1, 0.9], Extrapolate.CLAMP),
            transform: [
                {
                    scale: interpolate(props.y.value, [0, -150], [1, 1.1], Extrapolate.CLAMP),
                },
            ],


        };
    });

    const rTitleStyle = useAnimatedStyle(() => {

        return {
            transform: [
                {
                    translateY: interpolate(props.y.value, [0, 0], [-10, 10], Extrapolate.CLAMP)
                },

                {
                    scale: interpolate(props.y.value, [0, 100], [1, 0.8], Extrapolate.CLAMP)
                },

                {
                    translateX: interpolate(props.y.value, [0, 100], [0, -50], Extrapolate.CLAMP)
                },
            ]
        };
    }
    );



    return (
        <Animated.View style={[styles.headerContainer]}>
            <Animated.Image
                source={props.source}
                style={[styles.image, rImageStyle]}
            />

            <Animated.View style={[styles.titleContainer, rTitleStyle]}>
                <Heading size="large" weight="Black" color={Colors.gold}>
                    Prufrock Coffee
                </Heading>
            </Animated.View>

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: "absolute",
        top: 20,
        left: 0,
        width: wWidth,
        height: HEADER_IMAGE_HEIGHT,
        overflow: "hidden",
    },
    titleContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: wWidth,
        height: HEADER_IMAGE_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        paddingHorizontal: 20,


    },


    image: {
        position: "absolute",
        width: wWidth,
        resizeMode: "cover",
        marginTop: 50,
    },

});
