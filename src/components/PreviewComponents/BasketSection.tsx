import React, { useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';
import { OrderingContext } from '../../contexts';
import { BasketItem } from '../BasketItem';

interface BasketSectionProps { }

export const BasketSection = (props: BasketSectionProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext);

    const total = ordering_state.common_basket.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Body size="medium" weight="Bold">
                    Basket
                </Body>
            </View>

            {ordering_state.common_basket.length === 0 &&
                <View style={styles.emptyContainer}>
                    <Body size="medium" weight="Bold" color={Colors.brown2}>Add some items to your basket!</Body>
                </View>
            }
            <View style={styles.itemRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {ordering_state.common_basket.map((item, index) => {
                        return <BasketItem key={index} item={item} />;
                    })}
                    {/* <View style={styles.addItemButton}>
                        <Body size="medium" weight="Bold" color={Colors.darkBrown2}>
                            +
                        </Body>
                    </View> */}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.greyLight1,
        marginVertical: Spacings.s2,
        height: 120,
    },
    header: {
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: Spacings.s2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacings.s2,
    },

    itemRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addItemButton: {
        backgroundColor: Colors.brownLight2,
        borderRadius: Spacings.s3,
        height: 40,
        width: 40,
        marginTop: Spacings.s4,
        marginLeft: Spacings.s2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
