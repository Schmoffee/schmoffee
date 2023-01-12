import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActionButton} from './ActionButton';
import {FooterType} from '../../../utils/types/component.types';
import {OrderingContext} from '../../../contexts';
import {Colors, Spacings} from '../theme';
import {Body} from '../typography';

export const Footer = (props: FooterType) => {
  const {ordering_state} = useContext(OrderingContext);

  const getBasketPrice = () => {
    let price = 0;
    ordering_state.specific_basket.forEach(item => {
      price += item.price * item.quantity;
    });
    return price;
  };

  const getBasketQuantity = () => {
    let quantity = 0;
    ordering_state.specific_basket.forEach(item => {
      quantity += item.quantity;
    });
    return quantity;
  };

  return (
    <View style={styles.root}>
      {props.hide ? null : (
        <View style={styles.container}>
          <ActionButton
            label={props.buttonText ? props.buttonText : 'Continue'}
            disabled={props.buttonDisabled}
            onPress={() => props.onPress()}
            variant={props.buttonVariant ? props.buttonVariant : 'primary'}
          />
          {props.children ? <View style={styles.childrenContainer}>{props.children}</View> : null}

          {props.type === 'basket' ? (
            <>
              <View style={styles.basketLengthContainer}>
                <Body size="large" weight="Bold" color={props.buttonDisabled ? 'transparent' : Colors.darkBrown2}>
                  {getBasketQuantity()}
                </Body>
              </View>
              <View style={styles.basketPriceContainer}>
                <Body size="large" weight="Bold" color={Colors.white}>{`£${getBasketPrice().toFixed(2)}`}</Body>
              </View>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: Spacings.s3,
    width: '100%',
    height: 100,
    zIndex: 999,
    paddingHorizontal: Spacings.s1,
  },

  childrenContainer: {
    alignSelf: 'center',
    marginTop: Spacings.s4,
  },
  container: {
    justifyContent: 'center',
    // height: 100,
  },
  basketLengthContainer: {
    backgroundColor: Colors.goldFaded4,
    borderRadius: 10,
    width: 30,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 14,
    left: 20,
  },
  basketPriceContainer: {
    borderRadius: 10,
    width: 60,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    right: 20,
  },
});
