import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';
import { OrderingContext } from '../../contexts';
import { BasketItem } from './BasketItem';

interface BasketPreviewProps {
    translateY?: Animated.SharedValue<number>;
}

export const BasketPreview = (props: BasketPreviewProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
    return (
        <View style={styles.itemRow} >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ordering_state.specific_basket.map((item, index) => {
                    return <BasketItem key={index} item={item} />;
                })}
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
