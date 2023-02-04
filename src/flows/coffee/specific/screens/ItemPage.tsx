import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Body, Heading } from '../../../common/typography';
import { setSpecificBasket } from '../../../../utils/helpers/storage';
import { Colors, Spacings } from '../../../common/theme';
import { Option, OptionType, OrderItem, OrderOption } from '../../../../models';
import { Footer } from '../../../common/components/Footer';
import { OrderingContext } from '../../../../contexts';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';
import { OrderingActionName } from '../../../../utils/types/enums';
import OptionCarousel from '../../components/menu/OptionCarousel';
import { findSameItemIndex } from '../../../../utils/helpers/basket';
import FastImage from 'react-native-fast-image';
import { HEIGHT, WIDTH } from '../../../../../constants';
import QuantitySelector from '../../components/menu/QuantitySelector';

const { width } = Dimensions.get('window');

interface ItemPageProps {
  route?: any;
  navigation: any;
}
const ItemPage = ({route, navigation}: ItemPageProps) => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const [selectedMilk, setMilk] = useState<OrderOption>();
  const [selectedSyrup, setSyrup] = useState<OrderOption>();
  const [quantity, setQuantity] = useState(1);
  const { item, imageSpecs } = route?.params;
  const milkOptions = item?.options?.filter((option: Option) => option.option_type === OptionType.MILK);
  const syrupOptions = item?.options?.filter((option: Option) => option.option_type === OptionType.SYRUP);

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

  async function addItem() {
    let newBasket: OrderItem[] = ordering_state.specific_basket;
    const cleaned_options = [selectedMilk, selectedSyrup].filter(option => option !== undefined) as OrderOption[];
    const index = findSameItemIndex(newBasket, item, cleaned_options);
    if (index !== -1) {
      newBasket[index] = {...newBasket[index], quantity: newBasket[index].quantity + 1};
      ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
      await setSpecificBasket(newBasket);
    } else {
      const new_order_item: OrderItem = {
        quantity: quantity,
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
      <View style={styles.leftChevron}>
        <LeftChevronBackButton color={'#fff'} />
      </View>

      <Animated.Image
        source={require('../../../../assets/pngs/semi-circle.png')}
        style={[styles.semiCircle, rCircleStyle]}
      />
      <Animated.View style={[styles.headerContainer, titleStyle]}>
        <Heading size="large" weight="Bold" color={Colors.white}>
          {item.name}
        </Heading>
      </Animated.View>
      <Animated.View style={[styles.imageContainer, rImageStyle]} >
        <FastImage source={{ uri: item.image ? item.image : undefined }} style={styles.image} />
      </Animated.View>

      <Animated.View style={[styles.priceQuantityContainer]}>
        <View style={styles.priceContainer}>
          <Body size="medium" weight="Bold" color={Colors.white}>
            £{(item.price / 100).toFixed(2)}
          </Body>
        </View>
        <View style={styles.quantityContainer}>
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </View>

      </Animated.View>

      <Animated.View style={[styles.optionsContainer, optionsStyle]}>
        <View style={styles.milkOptions}>
          <OptionCarousel data={milkOptions} pagination={false} setOption={setMilk} />
        </View>
        <View style={styles.syrupOptions}>
          <OptionCarousel data={syrupOptions} pagination={false} setOption={setSyrup} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.descriptionContainer, descriptionStyle]}>
        <Heading size="small" weight="Bold" color={Colors.darkBrown} style={{ marginBottom: Spacings.s2 }}>
          Allergens & Ingredients
        </Heading>

        <Body size="small" weight="Bold" color={Colors.darkBrown2}>
          {item.description}
          We have addition of additives such as sugar, milk, cream, or added flavors.
        </Body>

        {/* <View style={styles.extraDetailsContainer}>
          <Body size="small" weight="Bold" color={Colors.darkBrown2}>
            Prep time
          </Body>
          <Body size="small" weight="Bold" color={Colors.darkBrown2}>
            {item.preparation_time} min
          </Body>
        </View> */}

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
    left: Spacings.s13,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  leftChevron: {
    position: 'absolute',
    top: 40,
    left: -20,
    zIndex: 3,
    elevation: 3,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkBrown,
    position: 'absolute',
    top: HEIGHT / 5.5,
    zIndex: 1,
    borderWidth: 5,
    borderColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '90%',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '25%',
    width: '50%',
    height: 33,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: Colors.darkBrown2,
  },
  priceContainer: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  quantityContainer: {
    width: '52%',
    height: '130%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darkBrown,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: Colors.greenFaded1,
    marginLeft: Spacings.s1
  },


  descriptionContainer: {
    paddingHorizontal: Spacings.s6,
    position: 'absolute',
    top: HEIGHT / 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },


  optionsContainer: {
    marginTop: Spacings.s7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 65,
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
  descriptionContainer: {
    paddingHorizontal: Spacings.s6,
    position: 'absolute',
    top: HEIGHT / 1.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  extraDetailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: Spacings.s4,
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
