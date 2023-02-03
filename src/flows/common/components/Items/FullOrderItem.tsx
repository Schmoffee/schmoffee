import React from 'react';
import {StyleSheet, View} from 'react-native';
import {OrderItem} from '../../../../models';
import {Colors, Spacings} from '../../theme';
import {BasketItem} from './BasketItem';
import {getOptionsPrice} from '../../../../utils/helpers/basket';
import {Body} from '../../typography';

interface FullOrderItemProps {
  item: OrderItem;
  index: number;
}
const FullOrderItem = (props: FullOrderItemProps) => {
  const {item} = props;
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemImage}>
        <BasketItem item={item} />
      </View>
      <View style={styles.detailsColumn}>
        <Body size="medium" weight="Bold" color={Colors.white}>
          {item.name}
        </Body>
        {item.options?.map(opt => (
          <Body size="small" weight="Bold" color={Colors.greyLight3}>
            {'- ' + opt.name}
          </Body>
        ))}
      </View>
      <Body size="small" weight="Bold" color={Colors.greyLight2} style={{position: 'absolute', right: 0}}>
        £{(((item.price + getOptionsPrice(item)) * item.quantity) / 100).toFixed(2)}
      </Body>
    </View>
  );
};

export default FullOrderItem;

const styles = StyleSheet.create({
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
    marginHorizontal: Spacings.s4,
    marginRight: Spacings.s8,
  },

  itemImage: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
