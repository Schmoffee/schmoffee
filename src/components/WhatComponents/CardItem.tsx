import React, {FC, useCallback, useContext, useReducer} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Colors, Spacings} from '../../../theme';
import {Body} from '../../../typography';
import {Item, OrderInfo, OrderItem} from '../../models';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {OrderingContext} from '../../contexts';

interface CardItemProps {
  item: Item;
}

export const CardItem = ({item}: CardItemProps) => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);

  const onPress = useCallback(
    (item: Item) => {
      ordering_dispatch({type: 'SET_COMMON_BASKET', payload: [...ordering_state.common_basket, item]});
    },
    [ordering_state, ordering_dispatch],
  );

  const onAddItem = useCallback(() => {
    if (ordering_state.common_basket.find((basketItem: OrderItem) => basketItem.name === item.name)) {
      const index = ordering_state.common_basket.findIndex((basketItem: OrderItem) => basketItem.name === item.name);
      const newBasket = [...ordering_state.common_basket];
      newBasket[index].quantity = newBasket[index].quantity + 1;
      ordering_dispatch({type: 'SET_COMMON_BASKET', payload: newBasket});
      console.log('item already in basket', ordering_state.common_basket[index]);
    } else {
      onPress(item);
    }
  }, [ordering_state, ordering_dispatch, item, onPress]);

  return (
    <TouchableOpacity onPress={onAddItem}>
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Body size="medium" weight="Regular" color={Colors.darkBrown2}>
              {item.name}
            </Body>
          </View>
          <View style={styles.priceContainer}>
            <Body size="medium" weight="Bold" color={Colors.darkBrown2}>{`£${item.price.toFixed(2)}`}</Body>
            <TouchableOpacity>
              <View style={styles.iconContainer} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={item.image} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {},
  container: {
    backgroundColor: Colors.goldFaded2,
    borderRadius: Spacings.s5,
    padding: Spacings.s2,
    margin: Spacings.s2,
    height: 120,
    width: 110,
    justifyContent: 'space-evenly',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  imageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    transform: [{scale: 0.9}],
  },
  textContainer: {
    marginTop: 50,
    // backgroundColor: Colors.red,
  },
  priceContainer: {
    // backgroundColor: Colors.blue,
    width: '100%',
    height: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    backgroundColor: Colors.darkBrown2,
    width: 20,
    height: 20,
    borderRadius: Spacings.s3,
    marginRight: Spacings.s1,
  },
});
