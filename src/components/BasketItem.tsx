import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Easing } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacings } from '../../theme';
import { Body } from '../../typography';
import { OrderingContext } from '../contexts';
import { OrderItem } from '../models';
import { CoffeeRoutes } from '../utils/types/navigation.types';

interface BasketItemProps {
  item: OrderItem;
}

export const BasketItem = (props: BasketItemProps) => {
  const { item } = props;
  console.log(item)
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>()
  const imageRef = useRef<Image>()



  const onItemPress = () => {
    'worklet';
    //measure image position & size
    imageRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
      let imageSpecs = { width, height, pageX, pageY, borderRadius: 10 }
      navigation.navigate('ItemPage', {
        item,
        imageSpecs
      },
      );
    });
  };

  const getQuantity = () => {
    let quantity = 0;
    ordering_state.common_basket.forEach(basketItem => {
      if (basketItem.name === item.name) {
        quantity = basketItem.quantity;
      }
    });
    return quantity;
  };

  const onReduceQuantity = () => {
    const index = ordering_state.common_basket.findIndex((basketItem: any) => basketItem.name === item.name);
    if (index > -1) {
      const newBasket = [...ordering_state.common_basket];
      newBasket[index].quantity = newBasket[index].quantity - 1;
      ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
    }
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
    if (index > -1) {
      const newBasket = [...ordering_state.common_basket];

      if (newBasket[index].quantity === 1) {
        newBasket.splice(index, 1);
      } else {
        newBasket[index].quantity = newBasket[index].quantity - 1;
      }

      ordering_dispatch({ type: 'SET_COMMON_BASKET', payload: newBasket });
    }
  };

  return (
    <TouchableOpacity onPress={onItemPress} style={styles.container}>
      <View style={styles.item}>
        <View style={styles.itemImage}>
          <Image ref={imageRef} source={props.item.image} style={styles.image} />
        </View>
        <View style={styles.quantityLabel}>
          <Body size="small" weight="Regular" color={Colors.darkBrown2}>
            {getQuantity()}
          </Body>
        </View>
        <Body size="small" weight="Regular" color={Colors.darkBrown2}>
          {props.item.name}
        </Body>
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
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.greyLight2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 50,
    borderRadius: 25,
  },
  quantityLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.goldFaded2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
