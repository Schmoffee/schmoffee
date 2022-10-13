import React, { useContext, useState } from 'react'
import { Pressable, StyleSheet, View, Image } from 'react-native'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { useNavigation } from '@react-navigation/native'
import { OrderingContext } from '../../../contexts'
import { Cafe, Item } from '../../../models'
import { Body, Heading } from '../../../../typography'
import { Colors, Spacings } from '../../../../theme'
import { DATA_SHOPS } from '../../../data/shops.data'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CONST_SCREEN_HOME } from '../../../../constants'



interface RatingPageProps { }

interface RatingItemProps {
    item: Item,
}

const RatingItem = ({ item }: RatingItemProps) => {
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext)
    const navigation = useNavigation()
    const [rating, setRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])


    return (
        <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
                <Body size='large' weight='Regular'>{`${item.name} - ${item.price}`}</Body>
                {/* <Body size='large' weight='Regular'>{item.options}</Body> */}
                <View style={styles.ratingContainer}>
                    <View style={styles.rating}>
                        {maxRating.map((item, index) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} key={item} style={styles.ratingItem} onPress={() => setRating(item)}>
                                    <Image source={
                                        item <= rating ? require('../../../assets/pngs/star-filled.png') : require('../../../assets/pngs/star-outline.png')
                                    } style={item <= rating ? styles.ratingStar : styles.ratingStarOutline} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        </View>
    )
}

export const RatingPage = (props: RatingPageProps) => {
    const navigation = useNavigation()
    const current_shop = DATA_SHOPS[0] as Cafe;
    const { ordering_state, ordering_dispatch } = useContext(OrderingContext)
    return (
        <PageLayout header={'Rate your order'} footer={{
            buttonDisabled: false,
            onPress: () => navigation.navigate(CONST_SCREEN_HOME),
            buttonText: 'Rate',
        }}>
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <Heading size='default' weight='Bold'>{current_shop.name}</Heading>
                </View>
                {ordering_state.common_basket.map((item, index) => {
                    return (
                        <RatingItem item={item} key={index} />
                    )
                })}
            </View>

        </PageLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Spacings.s3,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    headingContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginLeft: Spacings.s10,

    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: Spacings.s5,
        borderBottomWidth: 1,
        paddingVertical: Spacings.s5,

    },
    detailsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        // backgroundColor: Colors.white,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.gold,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacings.s5,
    },
    image: {
        width: 45,
        height: 50,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: Spacings.s2,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
    },
    ratingItem: {
        width: 30,
        height: 30,
        borderRadius: 15,

    },
    ratingStar: {
        width: 30,
        height: 30,
        tintColor: Colors.gold,
        alignSelf: 'center',
    },
    ratingStarOutline: {
        width: 24,
        height: 24,
        tintColor: Colors.gold,
        alignSelf: 'center',
        marginTop: 3.5,
    }


})
