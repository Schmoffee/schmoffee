import { Dimensions, Image, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Body, Heading } from '../typography';
import { setSpecificBasket } from '../../../utils/helpers/storage';
import { Colors, Spacings } from '../theme';
import { OrderItem } from '../../../models';
import { Footer } from '../components/Footer';
import { OrderingContext } from '../../../contexts';
import LeftChevronBackButton from '../components/LeftChevronBackButton';
import SwipeableModal from '../components/SwipeableModal';

const { width } = Dimensions.get('window');

interface ItemPageProps {
  route?: any;
  navigation: any;
}

const ItemPage = ({ route, navigation }: ItemPageProps) => {
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);

  const { item, imageSpecs } = route?.params;

  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [anim]);

  const bottomContainerStyle = useAnimatedStyle(
    () => ({
      opacity: anim.value,
    }),
    [],
  );

  const rCircleStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value,
      transform: [
        {
          scale: interpolate(anim.value, [0, 1], [0, 1.2]),
        },
      ],
    }),
    [],
  );

  const titleStyle = useAnimatedStyle(
    () => ({
      opacity: anim.value,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-100, 0]),
        },
      ],
    }),
    [],
  );

  const descriptionStyle = useAnimatedStyle(
    () => ({
      opacity: anim.value,
      transform: [
        {
          translateX: interpolate(anim.value, [0, 1], [-300, 0]),
        },
      ],
    }),
    [],
  );

  const imageContainerStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      top: interpolate(anim.value, [0, 1], [imageSpecs.pageY, 150]),
      left: interpolate(anim.value, [0, 1], [imageSpecs.pageX, -15]),
      width: interpolate(anim.value, [0, 1], [imageSpecs.width, width * 1.1]),
      height: interpolate(anim.value, [0, 1], [imageSpecs.height, 350]),
      borderRadius: interpolate(anim.value, [0, 1], [imageSpecs.borderRadius, 0]),
      overflow: 'hidden',
    }),
    [],
  );

  const rImageStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: interpolate(anim.value, [0, 1], [0, 1.1]),
        },
      ],
    }),
    [],
  );

  async function addItem() {
    if (ordering_state.specific_basket.find((basketItem: OrderItem) => basketItem.name === item.name)) {
      const index = ordering_state.specific_basket.findIndex((basketItem: OrderItem) => basketItem.name === item.name);
      const newBasket: OrderItem[] = ordering_state.specific_basket;
      newBasket[index] = { ...newBasket[index], quantity: newBasket[index].quantity + 1 };
      ordering_dispatch({ type: 'SET_SPECIFIC_BASKET', payload: newBasket });
      await setSpecificBasket(newBasket);
    } else {
      const new_order_item: OrderItem = {
        quantity: 1,
        name: item.name,
        price: item.price,
        image: item.image,
        preparation_time: item.preparation_time,
        options: item.options,
        id: item.id,
      };
      const newBasket: OrderItem[] = [...ordering_state.specific_basket, new_order_item];
      ordering_dispatch({ type: 'SET_SPECIFIC_BASKET', payload: newBasket });
      await setSpecificBasket(newBasket);
    }
    const callback = () => navigation.goBack();
    anim.value = withTiming(0, {}, isFinished => isFinished && runOnJS(callback)());
  }

  return (
    <View style={styles.container}>
      <LeftChevronBackButton />

      <Animated.Image
        source={require('../../../assets/pngs/semi-circle.png')}
        style={[styles.semiCircle, rCircleStyle]}
      />
      <Animated.View style={[styles.headerContainer, titleStyle]}>
        <Heading size="large" weight="Bold" color={Colors.white}>
          {item.name}
        </Heading>
      </Animated.View>
      <Animated.View style={[styles.imageContainer, rImageStyle]} />



      <Animated.View style={[styles.descriptionContainer, descriptionStyle]}>
        <Body size="large" weight="Bold" color={Colors.darkBrown2}>
          {item.description}
        </Body>
      </Animated.View>

      <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
        <Footer buttonText="ADD" buttonDisabled={false} onPress={addItem} />
      </Animated.View>


    </View>
  );
};
export default ItemPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 250,
    // zIndex: 99999999,

  },
  semiCircle: {
    zIndex: -1,
    position: 'absolute',
    top: -450,
    left: -100,
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: Spacings.s9,
    right: 0,
    // height: 150,
    // backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  leftChevron: {
    position: 'absolute',
    top: 40,
    left: Spacings.s5,
    zIndex: 1,
  },

  descriptionContainer: {
    paddingHorizontal: Spacings.s7,
    position: 'absolute',
    bottom: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    position: 'absolute',
    top: 170,
    left: '24%',
    zIndex: 1,
    borderWidth: 5,
    borderColor: Colors.white,

  },
  image: {
    width: '80%',
    height: '90%',
  },

  bottomContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
  },
});
