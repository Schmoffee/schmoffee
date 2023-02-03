import React, {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {OrderingContext} from '../../../../contexts';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';
import {useNavigation} from '@react-navigation/native';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import OrderItemsList from '../../../track/components/OrderItemsList';

interface BasketSectionProps {
  translateY?: Animated.SharedValue<number>;
}

export const BasketSection = (props: BasketSectionProps) => {
  const {ordering_state} = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();
  const emptyBasketComponent =
    ordering_state.specific_basket.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Pressable onPress={() => navigation.navigate('ShopPage')}>
          <Body size="medium" weight="Bold" color={Colors.gold}>
            Click here to add some items to your basket!
          </Body>
        </Pressable>
      </View>
    ) : undefined;

  return <OrderItemsList items={ordering_state.specific_basket} optionalComponent={emptyBasketComponent} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBrown,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  header: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: Spacings.s2,
    paddingTop: Spacings.s2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacings.s8,
  },

  basketColumn: {
    // marginTop: Spacings.s4,
    flex: 1,

    flexDirection: 'column',
    alignItems: 'center',

    // backgroundColor: Colors.blue,
    marginBottom: Spacings.s1,
  },

  headerRow: {},

  itemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: Spacings.s3,
    // backgroundColor: Colors.red,
    paddingHorizontal: Spacings.s14,
    marginRight: Spacings.s16,
  },

  detailsColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: Spacings.s4,
    marginRight: Spacings.s8,
  },

  itemImage: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addItemButton: {
    backgroundColor: Colors.brownLight2,
    borderRadius: Spacings.s3,
    height: 40,
    width: 40,
    marginTop: Spacings.s4,
    marginLeft: Spacings.s2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
