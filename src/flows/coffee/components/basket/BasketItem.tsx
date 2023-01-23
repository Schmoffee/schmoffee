import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Pressable, View} from 'react-native';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {setSpecificBasket} from '../../../../utils/helpers/storage';
import {Colors, Spacings} from '../../../common/theme';
import {OrderItem, OrderOption} from '../../../../models';
import {Body} from '../../../common/typography';
import {OrderingContext} from '../../../../contexts';
import {OrderingActionName} from '../../../../utils/types/enums';
import FastImage from 'react-native-fast-image';
import {equalsCheck, findSameItemIndex} from '../../../../utils/helpers/basket';

type Size = 'small' | 'medium' | 'large';

interface BasketItemProps {
  item: OrderItem;
  size?: Size;
}

export const BasketItem = (props: BasketItemProps) => {
  const {item} = props;
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const anim = useSharedValue(0);
  const [expanded, setExpanded] = useState(false);

  const getQuantity = () => {
    const index = findSameItemIndex(ordering_state.specific_basket, item);
    return ordering_state.specific_basket[index]?.quantity || 0;
  };

  const onIncreaseQuantity = async () => {
    if (anim.value === 0) {
      return;
    } else {
      let newBasket: OrderItem[] = ordering_state.specific_basket;
      const index = findSameItemIndex(newBasket, item);
      if (index > -1) {
        newBasket[index] = {...newBasket[index], quantity: newBasket[index].quantity + 1};
        ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
        await setSpecificBasket(newBasket);
      }
    }
  };
  const onRemoveItem = (index: number) => {
    if (anim.value === 0) {
      return;
    } else {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your basket?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              setExpanded(false);
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              let newBasket: OrderItem[] = ordering_state.specific_basket;
              newBasket.splice(index, 1);
              ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
              await setSpecificBasket(newBasket);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  const onReduceQuantity = async () => {
    if (anim.value === 0) {
      anim.value = withTiming(1);
    } else {
      let newBasket: OrderItem[] = ordering_state.specific_basket;
      const index = findSameItemIndex(newBasket, item);
      if (index > -1) {
        if (newBasket[index].quantity === 1) {
          onRemoveItem(index);
        } else {
          newBasket[index] = {...newBasket[index], quantity: newBasket[index].quantity - 1};
          ordering_dispatch({type: OrderingActionName.SET_SPECIFIC_BASKET, payload: newBasket});
          await setSpecificBasket(newBasket);
        }
      }
    }
  };

  const rItemStyle = useAnimatedStyle(
    () => ({
      marginHorizontal: interpolate(anim.value, [0, 1], [-4, 15]),
      transform: [{scale: interpolate(anim.value, [0, 1], [1, 1.15])}],
    }),
    [],
  );

  const rQuantityStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: 39 * -anim.value}, {translateY: 4 * -anim.value}],
    };
  }, []);

  const rQuantityLabelStyle = useAnimatedStyle(() => {
    return {
      // opacity: anim.value,
      transform: [{translateX: 24.5 * anim.value}],
    };
  }, []);

  const rIncrQuantStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{translateX: interpolate(anim.value, [0, 1], [50, 60])}],
    };
  }, []);

  const rRedQuantStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{translateX: interpolate(anim.value, [0, 1], [-30, -12])}],
    };
  }, []);

  const rItemNameStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{translateY: 8 * anim.value}],
    };
  }, []);

  useEffect(() => {
    if (!expanded) {
      anim.value = withTiming(0);
    } else if (expanded) {
      anim.value = withTiming(1);
    } else {
      anim.value = withTiming(0);
    }
  }, [expanded]);

  const onItemPress = () => {
    // 'worklet';
    // //measure image position & size
    // imageRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
    //   let imageSpecs = { width, height, pageX, pageY, borderRadius: 10 }
    //   navigation.navigate('ItemPage', {
    //     item,
    //     imageSpecs
    //   },
    //   );
    // });

    setExpanded(!expanded);
    // anim.value = withTiming(expanded ? 0 : 1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  };

  return (
    <Pressable onPress={onItemPress} style={styles.container}>
      <View style={styles.item}>
        <Animated.View style={[rItemStyle]}>
          <View style={styles.itemImage}>
            <FastImage source={{uri: props.item.image ? props.item.image : undefined}} style={styles.image} />
            <Animated.View style={[styles.quantityContainer, rQuantityStyle]}>
              <Animated.View style={[styles.quantityLabel, rQuantityLabelStyle]}>
                <Body size="medium" weight="Bold" color={Colors.darkBrown}>
                  {getQuantity()}
                </Body>
              </Animated.View>
              <Animated.View style={[styles.quantityPlusButton, rIncrQuantStyle]}>
                <Pressable onPress={onIncreaseQuantity} style={styles.quantityPlusButton2}>
                  <Body size="large" weight="Bold" style={styles.quantityPlusText}>
                    +
                  </Body>
                </Pressable>
              </Animated.View>
              <Animated.View style={[styles.quantityPlusButton, rRedQuantStyle]}>
                <Pressable onPress={onReduceQuantity} style={styles.quantityPlusButton2}>
                  <Body size="large" weight="Bold" style={styles.quantityPlusText}>
                    -
                  </Body>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 70,
    justifyContent: 'center',
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s2,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 3.5,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Colors.red,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },

  quantityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 30,
    height: 30,
    borderRadius: 30,
    position: 'relative',
    top: -40,
    right: -15,
  },
  quantityLabel: {
    width: 22,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityPlusButton: {
    width: 22,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityPlusButton2: {
    width: 22,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityPlusText: {
    color: Colors.darkBrown2,
    fontSize: 16,
    lineHeight: 20,
  },
  random: {
    marginLeft: 60,
  },
  itemName: {
    marginTop: Spacings.s2,
  },
});
