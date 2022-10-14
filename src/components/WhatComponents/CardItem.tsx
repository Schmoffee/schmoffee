import React, { FC, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';
import { Item, OrderInfo, OrderItem } from '../../models';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { OrderingContext } from '../../contexts';
import { useNavigation } from '@react-navigation/native';
import { CoffeeRoutes } from '../../utils/types/navigation.types';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface CardItemProps {
    item: Item;
    index: number;
    query?: string;
}

export const CardItem = ({ item, index, query }: CardItemProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
    const navigation = useNavigation<CoffeeRoutes>()
    const imageRef = useRef<Image>()
    const anim = useSharedValue(0);
    useEffect(() => {
        anim.value = -1;
        anim.value = withTiming(1, {
            duration: 900,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
    }, []);




    const onItemPress = () => {
        'worklet';
        //measure image position & size
        imageRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
            let imageSpecs = { width, height, pageX, pageY, borderRadius: 10 }
            navigation.navigate('ItemPage', {
                item,
                imageSpecs
            },
            );
        });
    };

    const onAddItem = useCallback(() => {
        if (ordering_state.common_basket.find((basketItem: OrderItem) => basketItem.name === item.name)) {
            const index = ordering_state.common_basket.findIndex((basketItem: OrderItem) => basketItem.name === item.name);
            const newBasket = [...ordering_state.common_basket];
            // newBasket[index].quantity = newBasket[index].quantity + 1;
            ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
        } else {
            ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: [...ordering_state.common_basket, item] });
        }
    }, [ordering_state, ordering_dispatch, item]);

    const cardStyleDown = useAnimatedStyle(
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

    const cardStyleUp = useAnimatedStyle(
        () => ({
            opacity: anim.value,
            transform: [
                {
                    translateY: interpolate(anim.value, [0, 1], [100, 0])
                }
            ]
        }),
        []
    );

    return (
        <TouchableOpacity onPress={onItemPress}>
            <Animated.View style={[styles.root, index % 2 === 0 ? cardStyleDown : cardStyleUp]}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Body size="medium" weight="Regular" color={Colors.darkBrown2}>
                            {item.name}
                        </Body>
                    </View>
                    <View style={styles.priceContainer}>
                        <Body size="medium" weight="Bold" color={Colors.darkBrown2}>{`£${item.price.toFixed(2)}`}</Body>
                        <TouchableOpacity>
                            <View style={styles.iconContainer} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image ref={imageRef} source={item.image} />
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    root: {},
    container: {
        backgroundColor: Colors.goldFaded2,
        borderRadius: Spacings.s5,
        padding: Spacings.s2,
        margin: Spacings.s2,
        height: 120,
        width: 110,
        justifyContent: 'space-evenly',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.2,
    },
    imageContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        top: -20,
        left: 0,
        right: 0,
        transform: [{ scale: 0.9 }],
    },
    textContainer: {
        marginTop: 50,
        // backgroundColor: Colors.red,
    },
    priceContainer: {
        // backgroundColor: Colors.blue,
        width: '100%',
        height: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconContainer: {
        backgroundColor: Colors.darkBrown2,
        width: 20,
        height: 20,
        borderRadius: Spacings.s3,
        marginRight: Spacings.s1,
    },
});
