import React, {useContext, useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {useNavigation} from '@react-navigation/native';
import {TrackOrderContext} from '../../../contexts';
import {Cafe, CurrentOrder, OrderItem} from '../../../models';
import {Body, Heading} from '../../../../typography';
import {Colors, Spacings} from '../../../../theme';
import {DATA_SHOPS} from '../../../data/shops.data';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CONST_SCREEN_HOME} from '../../../../constants';
import {terminateOrder} from '../../../utils/queries/datastore';

interface RatingPageProps {}

interface RatingItemProps {
  item: OrderItem;
  key: number;
}

const RatingItem = ({item}: RatingItemProps) => {
  const {track_order_state, track_order_dispatch} = useContext(TrackOrderContext);
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    const ratings = track_order_state.ratings;
    const index = ratings.findIndex(rat => rat.itemID === item.id);
    ratings[index].rating = newRating;
    track_order_dispatch({type: 'SET_RATINGS', payload: ratings});
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Body size="large" weight="Regular">{`${item.name} - ${item.price}`}</Body>
        {/* <Body size='large' weight='Regular'>{item.options}</Body> */}
        <View style={styles.ratingContainer}>
          <View style={styles.rating}>
            {maxRating.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={item}
                  style={styles.ratingItem}
                  onPress={() => handleRatingChange(item)}>
                  <Image
                    source={
                      item <= rating
                        ? require('../../../assets/pngs/star-filled.png')
                        : require('../../../assets/pngs/star-outline.png')
                    }
                    style={item <= rating ? styles.ratingStar : styles.ratingStarOutline}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export const RatingPage = (props: RatingPageProps) => {
  const navigation = useNavigation();
  const current_shop = DATA_SHOPS[0] as Cafe;
  const {track_order_state} = useContext(TrackOrderContext);

  const handleTerminateOrder = async () => {
    const order: CurrentOrder = track_order_state.current_order as CurrentOrder;
    await terminateOrder(order.id, track_order_state.ratings);
    navigation.navigate('Coffee', {screen: CONST_SCREEN_HOME});
  };

  return (
    <PageLayout
      header={'Rate your order'}
      footer={{
        buttonDisabled: false,
        onPress: () => handleTerminateOrder(),
        buttonText: 'Rate',
      }}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Heading size="default" weight="Bold">
            {current_shop.name}
          </Heading>
        </View>
        {track_order_state.current_order?.items.map((item, index) => {
          return <RatingItem item={item} key={index} />;
        })}
      </View>
    </PageLayout>
  );
};

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
  },
});
