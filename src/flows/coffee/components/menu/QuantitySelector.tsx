import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Colors } from '../../../common/theme';
import { Body } from '../../../common/typography';

interface QuantitySelectorProps {
    quantity: number;
    setQuantity: (quantity: number) => void;
}

const QuantitySelector = (props: QuantitySelectorProps) => {

    const onMinus = () => {
        if (props.quantity === 1) {
            return;
        }
        else {
            props.setQuantity(props.quantity - 1);
        }
        console.log('Quantity is already 0', props.quantity);


    }

    const onPlus = () => {
        props.setQuantity(props.quantity + 1);
    }


    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={onMinus}>
                <Body style={styles.minusText}>-</Body>
            </Pressable>
            <Body size='large' color={Colors.white} style={styles.quantityText}>
                {props.quantity}
            </Body>
            <Pressable style={styles.button} onPress={onPlus}>
                <Body style={styles.plusText}>+</Body>
            </Pressable>
        </View>
    );
}

export default QuantitySelector;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',


    },
    button: {
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    plusText: {
        color: 'white',
        fontSize: 25,
    },
    minusText: {
        color: 'white',
        fontSize: 30,
    },
    quantityText: {
        // paddingHorizontal: 10,
        width: 20,
        textAlign: 'center',
    },


});


