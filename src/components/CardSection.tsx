import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Body } from '../../typography'
import { CardItem } from './CardItem'
import { Item } from '../models'
import { Colors, Spacings } from '../../theme'

interface CardSectionProps {
    title: string
    items: Item[]
}

export const CardSection = (props: CardSectionProps) => {
    const { title, items } = props
    return (
        <View style={styles.container}>
            <Body size='large' weight='Bold' color={Colors.darkBrown2}>{title}</Body>
            {items && items.length > 0 ? (
                <FlatList
                    horizontal
                    data={items}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    contentInsetAdjustmentBehavior="never"
                    snapToAlignment="center"
                    decelerationRate="fast"
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    renderItem={({ item }) => <CardItem item={item} />}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Body size='medium' weight='Black' color={Colors.darkBrown2}>Uh oh... there's nothing here!</Body>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.goldFaded4,
        marginVertical: Spacings.s1,
        borderBottomColor: Colors.brownFaded2,
        borderBottomWidth: 2,
    },
    cardContainer: {
        flexDirection: 'row',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacings.s2,
    },

})
