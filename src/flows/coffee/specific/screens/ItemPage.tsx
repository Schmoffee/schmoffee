import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Body, Heading} from '../../../common/typography';
import {setSpecificBasket} from '../../../../utils/helpers/storage';
import {Colors, Spacings} from '../../../common/theme';
import {Option, OptionType, OrderItem, OrderOption} from '../../../../models';
import {Footer} from '../../../common/components/Footer';
import {OrderingContext} from '../../../../contexts';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';
import {OrderingActionName} from '../../../../utils/types/enums';
import OptionCarousel from '../../components/menu/OptionCarousel';

const {width} = Dimensions.get('window');

interface ItemPageProps {
  route?: any;
  navigation: any;
}
const ItemPage = ({route, navigation}: ItemPageProps) => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const [selectedMilk, setMilk] = useState<OrderOption>();
  const [selectedSyrup, setSyrup] = useState<OrderOption>();
  const {item, imageSpecs} = route?.params;
  const milkOptions = item?.options?.filter((option: Option) => option.option_type === OptionType.MILK);
  const syrupOptions = item?.options?.filter((option: Option) => option.option_type === OptionType.SYRUP);
  console.log('milk', selectedMilk);
  console.log('syrup', selectedSyrup);

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

  const optionsStyle = useAnimatedStyle(
    () => ({
      opacity: anim.value,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [90, 0]),
        },
      ],
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

  const equalsCheck = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v: string, i: number) => v === b[i]);

  async function addItem() {
    let newBasket: OrderItem[] = ordering_state.specific_basket;
    const index = newBasket.findIndex((basketItem: OrderItem) => {
      const same_name = basketItem.name === item.name;
      const has_options = basketItem.options && basketItem.options.length > 0;
      if (same_name) {
        const a = has_options ? basketItem.options.map((option: OrderOption) => option.name) : [];
        const selected = [selectedMilk, selectedSyrup].filter(option => option !== undefined) as OrderOption[];
        const b = selected.map((op: OrderOption) => op.name);
        return equalsCheck(a, b);
      }
      return false;
    });
    if (index !== -1) {
      newBasket[index] = {...newBasket[index], quantity: newBasket[index].quantity + 1};
      ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
      await setSpecificBasket(newBasket);
    } else {
      const new_order_item: OrderItem = {
        quantity: 1,
        name: item.name,
        price: item.price,
        image: item.image,
        preparation_time: item.preparation_time,
        options: [selectedMilk, selectedSyrup].filter(option => option !== undefined) as OrderOption[],
        id: item.id,
      };
      newBasket = [...ordering_state.specific_basket, new_order_item];
      ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
      await setSpecificBasket(newBasket);
    }
    const callback = () => navigation.goBack();
    anim.value = withTiming(0, {}, isFinished => isFinished && runOnJS(callback)());
  }

  return (
    <View style={styles.container}>
      <LeftChevronBackButton />

      <Animated.Image
        source={require('../../../../assets/pngs/semi-circle.png')}
        style={[styles.semiCircle, rCircleStyle]}
      />
      <Animated.View style={[styles.headerContainer, titleStyle]}>
        <Heading size="large" weight="Bold" color={Colors.white}>
          {item.name}
        </Heading>
      </Animated.View>
      <Animated.View style={[styles.imageContainer, rImageStyle]} />

      <Animated.View style={[styles.optionsContainer, optionsStyle]}>
        <View style={styles.milkOptions}>
          <OptionCarousel data={milkOptions} pagination={false} setOption={setMilk} />
        </View>
        <View style={styles.syrupOptions}>
          <OptionCarousel data={syrupOptions} pagination={false} setOption={setSyrup} />
        </View>
      </Animated.View>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greenFaded1,
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
    left: 5,
    zIndex: 3,
    elevation: 3,
    backgroundColor: Colors.blue,
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
    zIndex: 1,
    borderWidth: 5,
    borderColor: Colors.white,
  },
  image: {
    width: '80%',
    height: '90%',
  },

  optionsContainer: {
    // flex: 1,
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    width: '80%',
  },

  milkOptions: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: Colors.greenFaded3,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  syrupOptions: {
    width: '50%',
    borderLeftWidth: 1,
    borderLeftColor: Colors.greenFaded3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
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
