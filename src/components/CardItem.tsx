import React, { FC, useCallback, useContext, useReducer } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Colors, Spacings } from '../../theme'
import { Body } from '../../typography'
import { Item } from '../models'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { OrderingContext, orderingData } from '../contexts'
import { orderingReducer } from '../reducers'

interface CardItemProps {
    item: Item
}

export const CardItem = ({ item }: CardItemProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext)
    const onPress = useCallback((item: Item) => {
        ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: [...ordering_state.common_basket, item] });
        console.log('basket: ', ordering_state.common_basket.length);
    }, [ordering_state, ordering_dispatch]);



    return (

        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Body size='medium' weight='Regular' color={Colors.darkBrown2}>{item.name}</Body>
                    </View>
                    <View style={styles.priceContainer}>
                        <Body size='medium' weight='Bold' color={Colors.darkBrown2}>{`£${item.price}`}</Body>
                        <TouchableOpacity >
                            <View style={styles.iconContainer} />
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image source={item.image} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {

    },
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
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.5
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
})


