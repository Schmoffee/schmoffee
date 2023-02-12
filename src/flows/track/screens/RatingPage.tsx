import React, {useContext, useState} from 'react';
import {Image, Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {GlobalContext, TrackOrderContext} from '../../../contexts';
import {CurrentOrder} from '../../../models';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CONST_SCREEN_HOME, HEIGHT, WIDTH} from '../../../../constants';
import {terminateOrder} from '../../../utils/queries/datastore';
import {Body, Heading} from '../../common/typography';
import {PageLayout} from '../../common/components/PageLayout';
import {Colors, Spacings} from '../../common/theme';
import {GlobalActionName, TrackOrderActionName} from '../../../utils/types/enums';
import {LocalUser} from '../../../utils/types/data.types';

interface RatingPageProps {}

interface RatingItemProps {
  cafe: string | undefined;
  rating: number;
  setRating: (rating: number) => void;
}

const RatingItem = (props: RatingItemProps) => {
  const {track_order_state, track_order_dispatch} = useContext(TrackOrderContext);
  const navigation = useNavigation();
  const maxRating = [1, 2, 3, 4, 5];

  const handleRatingChange = (newRating: number) => {
    props.setRating(newRating);
    if (track_order_state.current_order) {
      const ratings = track_order_state.current_order.items.map(item => {
        return {
          itemID: item.id,
          rating: newRating,
        };
      });
      track_order_dispatch({type: TrackOrderActionName.SET_RATINGS, payload: ratings});
    } else {
      console.log('no current order');
    }
  };

  return (
    <View style={styles.ratingContainer}>
      {maxRating.map((it, index) => {
        return (
          <Pressable key={it} onPress={() => handleRatingChange(it)}>
            <Image
              source={
                it <= props.rating
                  ? require('../../../assets/pngs/star-filled.png')
                  : require('../../../assets/pngs/star-outline.png')
              }
              style={styles.ratingStar}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export const RatingPage = (props: RatingPageProps) => {
  const navigation = useNavigation();
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const {track_order_state} = useContext(TrackOrderContext);
  const [rating, setRating] = useState(0);

  const handleTerminateOrder = async () => {
    const usual = !!global_state.current_user?.the_usual;
    const order: CurrentOrder = track_order_state.current_order as CurrentOrder;
    await terminateOrder(order.id, track_order_state.ratings, usual);
    global_dispatch({
      type: GlobalActionName.SET_CURRENT_USER,
      payload: {...(global_state.current_user as LocalUser), current_order: null},
    });
    navigation.navigate('Coffee', {screen: CONST_SCREEN_HOME});
  };

  return (
    <PageLayout
      backButton
      header={'How was your order?'}
      subHeader={'Help us improve our service by rating your order from ' + track_order_state.cafe?.name}
      footer={{
        buttonDisabled: rating === 0,
        onPress: () => handleTerminateOrder(),
        buttonText: 'Rate',
      }}>
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <Image source={{uri: track_order_state.cafe?.image as string}} style={styles.cafeImage} />
          <RatingItem rating={rating} setRating={setRating} cafe={track_order_state.current_order?.cafeID} />
          <TextInput placeholder="Tell us more..." style={styles.textFormContainer} />
          <Pressable onPress={() => console.log('Navigate to report page')}>
            <Body size="medium" weight="Bold" style={styles.reportButton}>
              Report an issue
            </Body>
          </Pressable>
        </View>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacings.s3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    position: 'absolute',
    left: Spacings.s3,

  },
  detailsContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: HEIGHT / 25,
  },
  cafeImage: {
    width: WIDTH * 0.8,
    height: 200,
    borderRadius: 10,
    border: 1,
    borderWidth: 1,
    marginBottom: Spacings.s10,
  },
  ratingContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  ratingStar: {
    width: 43,
    height: 40,
    tintColor: Colors.gold,
    alignSelf: 'center',
    marginTop: 3.5,
    margin: 10,
  },
  textFormContainer: {
    flex: 1,
    width: WIDTH * 0.7,
    height: 40,
    borderRadius: 0,
    border: 1,
    borderWidth: 0.5,
    marginTop: Spacings.s10,
    paddingHorizontal: Spacings.s4,
  },
  reportButton: {
    color: Colors.red,
    marginTop: Spacings.s10,
  },
});
