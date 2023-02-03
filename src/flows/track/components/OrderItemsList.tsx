import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FullOrderItem from '../../common/components/Items/FullOrderItem';
import {Colors, Spacings} from '../../common/theme';
import Animated from 'react-native-reanimated';
import {OrderItem} from '../../../models';

interface OrderItemsListProps {
  translateY?: Animated.SharedValue<number>;
  items: OrderItem[];
  optionalComponent?: React.ReactNode;
}

const OrderItemsList = (props: OrderItemsListProps) => {
  const height = 100;
  const maxHeight = 350;
  const {items, optionalComponent} = props;
  const length = props.items.length;
  const getHeight = () => {
    if (length <= 1) {
      return height;
    } else if (length <= 2) {
      return height + 100;
    } else if (length >= 3) {
      return height + 250;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{height: getHeight(), maxHeight}}>
        {optionalComponent}
        <View style={styles.basketColumn}>
          <View style={styles.headerRow}>
            {items.map((item, index) => {
              return <FullOrderItem item={item} index={index} key={item.id + index} />;
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderItemsList;

const styles = StyleSheet.create({
  container: {
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

  headerRow: {},

  basketColumn: {
    // marginTop: Spacings.s4,
    flex: 1,

    flexDirection: 'column',
    alignItems: 'center',

    // backgroundColor: Colors.blue,
    marginBottom: Spacings.s1,
  },
});
