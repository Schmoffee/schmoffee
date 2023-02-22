import {StyleSheet, View, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import React, {useContext, useState} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import {Body, Heading} from '../../common/typography';
import {WIDTH} from '../../../../constants';
import {Colors, Spacings} from '../../common/theme';
import {GlobalContext, TrackOrderContext} from '../../../contexts';
import Map from '../../common/components/Map/Map';
import OrderItemsList from './OrderItemsList';

interface OrderCardCarouselProps {}

const OrderCardCarousel = (props: OrderCardCarouselProps) => {
  const {track_order_state} = useContext(TrackOrderContext);
  const {global_state} = useContext(GlobalContext);

  const scrollViewRef = useAnimatedRef();
  const [newData] = useState([
    {key: 'spacer-left'},
    {key: 'LEFT', image: require('../../../assets/pngs/nothing-outline.png')},
    {key: 'RIGHT', image: require('../../../assets/pngs/nothing-outline.png')},
    {key: 'spacer-right'},
  ]);
  const SIZE = WIDTH;
  const SPACER = WIDTH - SIZE + 50;
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // const currentIndex = Math.round(offsetX / SIZE);
  };

  return (
    <View style={styles.itemContainer}>
      <Animated.ScrollView
        // @ts-ignore
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
          if (item.key === 'spacer-left') {
            return <View key={item.key} style={{width: SPACER}} />;
          }
          if (item.key === 'spacer-right') {
            return <View key={item.key} style={{width: SPACER}} />;
          }
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rImageStyle = useAnimatedStyle(() => {
            const scale = interpolate(x.value, [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE], [0.65, 1, 0.65]);
            const opacity = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.55, 1, 0.55],
            );
            const translateX = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [-220, 0, 220],
            );
            return {
              transform: [{scale}, {translateX}],
              opacity,
            };
          });
          return (
            <View style={{width: SIZE}} key={index}>
              <Animated.View style={[styles.card, rImageStyle]}>
                {/* <Image source={image} style={styles.image} /> */}
                {item.key === 'LEFT' ? (
                  <View style={styles.childrenContainer} key={item.key}>
                    <Map
                      cafeIdFilter={global_state.current_order?.cafeID}
                      cafeLocationFilter={track_order_state.destination}
                      preview
                    />
                  </View>
                ) : item.key === 'RIGHT' ? (
                  <View style={styles.orderListContainer} key={item.key}>
                    <Body color={Colors.white} weight="Regular" size="large">
                      Items
                    </Body>
                    {/* <Body color={Colors.white} weight='Regular' size='small'>{track_order_state.current_order?.status}</Body> */}
                    <View style={{marginTop: Spacings.s4}}>
                      <OrderItemsList
                        scrollable={true}
                        items={global_state.current_order?.items ? global_state.current_order.items : []}
                      />
                    </View>

                    <View style={styles.priceContainer}>
                      <Heading color={Colors.white} weight="Regular" size="small">
                        Total:
                      </Heading>
                      <Heading color={Colors.white} weight="Bold" size="default">
                        £{(global_state.current_order ? global_state.current_order.total / 100 : 0).toFixed(2)}
                      </Heading>
                    </View>
                  </View>
                ) : null}
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default OrderCardCarousel;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    height: '100%',
    width: '75%',
    backgroundColor: Colors.darkBrown,
    // borderWidth: 1,
    borderRadius: 15,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },

  childrenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderListContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  orderItemLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemRight: {
    flex: 1,
    justifyContent: 'center',
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '75%',
    position: 'absolute',
    bottom: 20,
    borderWidth: 0,
    borderColor: Colors.greyLight3,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});
