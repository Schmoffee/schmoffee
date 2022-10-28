import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useEffect } from 'react';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { OrderItem } from '../../../models';
import { Footer } from '../../../components/Footer/Footer';
import { OrderingContext } from '../../../contexts';
import { Colors, Spacings } from '../../../../theme';
import { Body, Heading } from '../../../../typography';
const { width } = Dimensions.get('window');

interface ItemPageProps {
    route?: any;
    navigation: any;
}

const ItemPage = ({ route, navigation }: ItemPageProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext);

    const { item, imageSpecs } = route?.params;

    const anim = useSharedValue(0);
    useEffect(() => {
        anim.value = 0;
        anim.value = withTiming(1, {
            duration: 600,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
    }, []);

    const rPageStyle = useAnimatedStyle(() => ({
        opacity: anim.value,
    }));


    const bottomContainerStyle = useAnimatedStyle(
        () => ({
            opacity: anim.value
        }),
        []
    );

    const circleStyle = useAnimatedStyle(
        () => ({
            // opacity: anim.value,
            transform: [
                {
                    scale: interpolate(anim.value, [0, 1], [0, 2])
                }
            ]
        }),
        []
    );

    const titleStyle = useAnimatedStyle(
        () => ({
            opacity: anim.value,
            transform: [
                {
                    translateY: interpolate(anim.value, [0, 1], [-100, 0])
                }
            ]
        }),
        []
    );

    const descriptionStyle = useAnimatedStyle(
        () => ({
            opacity: anim.value,
            transform: [
                {
                    translateX: interpolate(anim.value, [0, 1], [-300, 0])
                }
            ]
        }),
        []
    );
    const onClosePress = () => {
        const callback = () => navigation.goBack();
        anim.value = withTiming(0, {}, isFinished => isFinished && runOnJS(callback)());
    };
    const imageContainerStyle = useAnimatedStyle(
        () => ({
            position: 'absolute',
            top: interpolate(anim.value, [0, 1], [imageSpecs.pageY - 60, 150]),
            left: interpolate(anim.value, [0, 1], [imageSpecs.pageX, -15]),
            width: interpolate(anim.value, [0, 1], [imageSpecs.width, width * 1.1]),
            height: interpolate(anim.value, [0, 1], [imageSpecs.height, 350]),
            borderRadius: interpolate(anim.value, [0, 1], [imageSpecs.borderRadius, 0]),
            overflow: 'hidden'
        }),
        []
    );


    const onAddItem = useCallback(() => {
        if (ordering_state.common_basket.find((basketItem: OrderItem) => basketItem.name === item.name)) {
            const index = ordering_state.common_basket.findIndex((basketItem: OrderItem) => basketItem.name === item.name);
            const newBasket = [...ordering_state.common_basket];
            newBasket[index].quantity = newBasket[index].quantity + 1;
            ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
        } else {
            ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: [...ordering_state.common_basket, item] });
        }
        onClosePress();
    }, [ordering_state, ordering_dispatch, item]);


    return (
        <Animated.View style={[styles.container, rPageStyle]}>
            <Animated.View style={[styles.bigSemiCircle, circleStyle]} />
            <Animated.View style={[styles.headerContainer, titleStyle]}>
                <Heading size='large' weight='Black' color={Colors.darkBrown2}>{item.name}</Heading>
            </Animated.View>
            <Animated.View style={[styles.imageContainer, imageContainerStyle]}>
                <Image style={styles.image} source={item.image} />
            </Animated.View>
            <Animated.View style={[styles.descriptionContainer, descriptionStyle]}>
                <Body size='large' weight='Bold' color={Colors.darkBrown2}>{item.description}</Body>
            </Animated.View>

            <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
                <Footer buttonText='ADD' buttonDisabled={false} onPress={() => onAddItem()} />
            </Animated.View>
        </Animated.View>
        // </PageLayout>

    );
};
export default ItemPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 250,
    },
    bigSemiCircle: {
        position: 'absolute',
        top: -250,
        width: '105%',
        justifyContent: 'center',
        height: '65%',
        borderRadius: 300,
        backgroundColor: Colors.brown,
        overflow: 'hidden',
    },
    headerContainer: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        height: 150,

        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    descriptionContainer: {
        paddingHorizontal: Spacings.s7,
        position: 'absolute',
        bottom: 150,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '80%',
        height: '90%'
    },
    btnClose: {
        // paddingHorizontal: 20,
        // paddingVertical: 10,
        // backgroundColor: '#000'
    },

    bottomContainer: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacings.s10,
        // backgroundColor: Colors.red,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        // backgroundColor: 'red',
    }
});