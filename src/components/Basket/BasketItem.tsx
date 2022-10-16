import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Easing, Alert } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';
import { OrderingContext } from '../../contexts';
import { OrderItem } from '../../models';
import { CoffeeRoutes } from '../../utils/types/navigation.types';

interface BasketItemProps {
  item: OrderItem;
}

export const BasketItem = (props: BasketItemProps) => {
  const { item } = props;
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>()
  const imageRef = useRef<Image>()
  const anim = useSharedValue(1);
  const [expanded, setExpanded] = useState(false);



  const getQuantity = () => {
    let quantity = 0;
    ordering_state.common_basket.forEach(basketItem => {
      if (basketItem.name === item.name) {
        quantity = basketItem.quantity;
      }
    });
    return quantity;
  };

  const onIncreaseQuantity = () => {
    const index = ordering_state.common_basket.findIndex((basketItem: any) => basketItem.name === item.name);
    if (index > -1) {
      const newBasket = [...ordering_state.common_basket];
      newBasket[index].quantity = newBasket[index].quantity + 1;
      ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
    }
  };
  const onRemoveItem = () => {
    const index = ordering_state.common_basket.findIndex((basketItem: any) => basketItem.name === item.name);
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your basket?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setExpanded(false);
          },
          style: 'cancel'

        },
        {
          text: 'OK', onPress: () => {

            if (index > -1) {
              const newBasket = [...ordering_state.common_basket];

              if (newBasket[index].quantity === 1) {
                newBasket.splice(index, 1);
              } else {
                newBasket[index].quantity = newBasket[index].quantity - 1;
              }
              ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
            }
          }
        }
      ],
      { cancelable: false }
    );
  };


  const onReduceQuantity = () => {
    const index = ordering_state.common_basket.findIndex((basketItem: any) => basketItem.name === item.name);
    if (index > -1) {
      const newBasket = [...ordering_state.common_basket];
      if (newBasket[index].quantity === 1) {
        onRemoveItem();
      } else {
        newBasket[index].quantity = newBasket[index].quantity - 1;
        ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
      }
    }
  };

  const rItemStyle = useAnimatedStyle(
    () => ({
      marginHorizontal: interpolate(anim.value, [0, 1], [-4, 15]),
      transform: [{ scale: interpolate(anim.value, [0, 1], [1, 1.15]) }],
    }),
    []
  );



  const rQuantityStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: 40 * -anim.value }, { translateY: 4 * -anim.value }],
    }
  }, [])



  const rQuantityLabelStyle = useAnimatedStyle(() => {
    return {
      // opacity: anim.value,
      transform: [{ translateX: 24.5 * anim.value }],
    };
  }, []);


  const rIncrQuantStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{ translateX: 24 * anim.value }],
    };
  }, []);

  const rRedQuantStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{ translateX: 114 * -anim.value }],
    };
  }, []);

  const rItemNameStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{ translateY: 2 * anim.value }],
    };
  }, []);



  useEffect(() => {
    if (!expanded) {
      anim.value = withTiming(0)
    } else {
      anim.value = withTiming(1)
    }
  }, [expanded, anim])


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

    setExpanded(!expanded)
    // anim.value = withTiming(expanded ? 0 : 1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  };


  return (
    <TouchableOpacity onPress={onItemPress} style={styles.container}>
      <View style={styles.item}>
        <Animated.View style={[rItemStyle]}>
          <View style={styles.itemImage}>
            <Image ref={imageRef} source={props.item.image} style={styles.image} />
            <Animated.View style={[styles.quantityContainer, rQuantityStyle]}>
              <Animated.View style={[styles.quantityLabel, rQuantityLabelStyle]}>
                <Body size="small" weight="Regular" color={Colors.darkBrown2}>
                  {getQuantity()}
                </Body>
              </Animated.View>
              <TouchableOpacity onPress={onIncreaseQuantity}>
                <Animated.View style={[styles.quantityPlusButton, rIncrQuantStyle]}>
                  <Text style={styles.quantityPlusText}>+</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReduceQuantity} style={styles.random}>
                <Animated.View style={[styles.quantityPlusButton, rRedQuantStyle]}>
                  <Text style={styles.quantityPlusText}>-</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.itemName]}>
          <Body size="small" weight="Regular" color={Colors.darkBrown2}>
            {props.item.name}
          </Body>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight1,
    marginVertical: Spacings.s2,
    flex: 1,
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s2,
    // backgroundColor: 'red',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 50,
  },

  quantityContainer: {
    flexDirection: 'row',
    width: 60,
    height: 20,
    // backgroundColor: Colors.blue,
    position: 'absolute',
    top: 0,
    right: -60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',


  },
  quantityLabel: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.goldFaded2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityPlusButton: {
    width: 30,
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
