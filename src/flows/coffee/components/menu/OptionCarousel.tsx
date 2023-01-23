import {StyleSheet, View, Image, useWindowDimensions, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import {Body} from '../../../common/typography';
import {Colors} from '../../../common/theme';
import {Option, OrderOption} from '../../../../models';

interface OptionCarouselProps {
  data: Option[];
  pagination?: boolean;
  setOption: (option: OrderOption | undefined) => void;
}

const OptionCarousel = (props: OptionCarouselProps) => {
  const {data, pagination, setOption} = props;
  const scrollViewRef = useAnimatedRef();
  const [newData] = useState([
    {key: 'spacer-left'},
    {key: 'nothing', image: require('../../../../assets/pngs/nothing-outline.png')},
    ...data,
    {key: 'spacer-right'},
  ]);
  const {width} = useWindowDimensions();
  const SIZE = width * 0.15;
  const SPACER = (width - SIZE) / 7;
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / SIZE);
    const selected = newData[currentIndex + 1];
    if (!selected.hasOwnProperty('key')) {
      const selectedOption = selected as Option;
      setOption({option_type: selectedOption.option_type, price: selectedOption.price, name: selectedOption.name});
    } else {
      setOption(undefined);
    }
  };

  return (
    <View>
      {pagination && <Pagination data={data} x={x} size={SIZE} />}
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        onMomentumScrollEnd={event => onMomentumScrollEnd(event)}
        showsHorizontalScrollIndicator={false}>
        {newData.map((item, index) => {
          const rImageStyle = useAnimatedStyle(() => {
            const scale = interpolate(x.value, [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE], [0.65, 1, 0.65]);
            const opacity = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.35, 1, 0.35],
            );
            return {
              transform: [{scale}],
              opacity,
            };
          });

          const rPriceStyle = useAnimatedStyle(() => {
            const opacity = interpolate(x.value, [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE], [0, 1, 0]);
            const translateY = interpolate(x.value, [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE], [20, 0, 0]);

            return {
              opacity,
              transform: [{translateY}],
            };
          });

          if (!item.hasOwnProperty('image')) {
            return <View style={{width: SPACER}} key={index} />;
          }
          const fullOption: Option = item as Option;

          const image = fullOption.hasOwnProperty('key') ? fullOption.image : {uri: fullOption.image};

          return (
            <View style={{width: SIZE}} key={index}>
              <View style={styles.itemContainer}>
                <Animated.View style={[styles.imageContainer, rImageStyle]}>
                  <Image source={image} style={styles.image} />
                </Animated.View>
                {index !== 1 && (
                  <Animated.View style={[styles.priceContainer, rPriceStyle]}>
                    <Body size="extraSmall" weight="Regular">
                      +{fullOption.price}p
                    </Body>
                  </Animated.View>
                )}
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default OptionCarousel;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  imageContainer: {
    borderRadius: 34,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    borderWidth: 0,
    borderColor: Colors.greyLight3,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});
