import React, {useEffect} from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Animated, {Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Colors, Spacings} from '../../../common/theme';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import {Body} from '../../../common/typography';
import {Item} from '../../../../models';

interface CardItemProps {
  item: Item;
  index: number;
  query?: string;
}

export const CardItem = ({item, index, query}: CardItemProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = -1;
    anim.value = withTiming(1, {
      duration: 900,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [anim]);

  const onItemPress = () => {
    'worklet';
    // measure image position & size
    navigation.navigate('ItemPage', {
      item,
    });
  };

  const cardStyleDown = useAnimatedStyle(
    () => ({
      // opacity: anim.value,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-100, 0]),
        },
      ],
    }),
    [],
  );

  const cardStyleUp = useAnimatedStyle(
    () => ({
      // opacity: anim.value,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [100, 0]),
        },
      ],
    }),
    [],
  );

  return (
    <Pressable onPress={onItemPress}>
      <Animated.View style={[styles.root, index % 2 === 0 ? cardStyleDown : cardStyleUp]}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Body size="medium" weight="Bold" color={Colors.darkBrown2} style={styles.titleText}>
              {item.name}
            </Body>
          </View>
          <View style={styles.priceContainer}>
            <Body size="medium" weight="Bold" color={Colors.white} style={styles.priceText}>{`£${(
              item.price / 100
            ).toFixed(2)}`}</Body>
            <View style={styles.iconContainer}>
              <Image source={require('../../../../assets/pngs/plus.png')} style={styles.plusButton} />
            </View>
          </View>
          <View style={styles.imageContainer}>
            <FastImage source={{uri: item.image ? item.image : undefined}} style={styles.image} />
            <View style={styles.ratingContainer}>
              <Body size="extraSmall" weight="Regular" color={Colors.black} style={styles.ratingText}>
                {item.ratings
                  ? item.ratings.length > 0
                    ? (
                        item.ratings.reduce((acc, curr) => acc + (curr ? curr.rating : 0), 0) / item.ratings.length
                      ).toFixed(1)
                    : 'None'
                  : 'None'}
              </Body>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
  },

  container: {
    position: 'relative',
    overflow: 'hidden',
    width: 160,
    height: 210,
    backgroundColor: Colors.white,
    borderRadius: Spacings.s5,
    borderWidth: 1,
    borderColor: Colors.greyLight2,
    padding: Spacings.s2,
    margin: Spacings.s2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 30,
      height: 3,
    },
    shadowRadius: 35,
    shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  imageContainer: {
    backgroundColor: Colors.darkBrown,
    height: 130,
    width: 140,
    borderRadius: 20,
    margin: Spacings.s3,
    position: 'absolute',
    top: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{scale: 0.9}],
  },
  ratingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 20,
    width: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    position: 'absolute',
    right: 0,
  },
  textContainer: {
    marginTop: 130,
    width: '100%',
  },
  priceContainer: {
    backgroundColor: Colors.darkBrown,
    width: 135,
    height: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
  },
  titleText: {
    marginVertical: Spacings.s1,
    marginHorizontal: Spacings.s1,
  },
  priceText: {
    marginLeft: 40,
  },
  ratingText: {
    position: 'absolute',
    right: 7,
    top: 4,
  },

  ratingStar: {
    height: 15,
    width: 15,
    position: 'absolute',
    left: 0,
    tintColor: Colors.gold,
  },
  plusButton: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: 3,
    top: 3,
    tintColor: Colors.white,
  },
  iconContainer: {
    backgroundColor: Colors.darkBrown,
    borderColor: Colors.white,
    borderWidth: 4,
    width: 35,
    height: 35,
    borderRadius: 40,
    left: 10,
  },
});
