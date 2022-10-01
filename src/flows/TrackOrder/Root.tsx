import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../contexts';
import {DataStore} from 'aws-amplify';
import {
  Cafe,
  CurrentOrder,
  OrderInfo,
  OrderItem,
  OrderStatus,
} from '../../models';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {getBestShop, sendOrder} from '../../utils/queries/datastore';

const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [orderId, setOrderId] = useState<string>('');

  /**
   * Get the user's curent order from the database and subscribe to any changes to it.
   */
  useEffect(() => {
    if (global_state.auth_user && global_state.current_user && orderId !== '') {
      const subscription = DataStore.observeQuery(CurrentOrder, current_order =>
        current_order.id('eq', orderId),
      ).subscribe(snapshot => {
        const {items, isSynced} = snapshot;
        if (items.length === 1) {
          global_dispatch({
            type: 'SET_CURRENT_USER',
            payload: {...global_state.current_user, current_order: items[0]},
          });
        } else {
          items.length === 0
            ? console.log('No current order found')
            : console.log('More than one current order found');
        }
        if (isSynced) {
          console.log('Synced');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [
    global_dispatch,
    global_state.auth_user,
    global_state.current_user,
    orderId,
  ]);

  return (
    <View>
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          },
          styles.wrapperCustom,
        ]}
        onPress={async () => {
          let ordered_items: OrderItem[] = [];
          let total = 0;
          for (const common_item of global_state.common_items) {
            const order_item: OrderItem = {
              name: common_item.name,
              price: common_item.price,
              options: null,
            };
            ordered_items.push(order_item);
            total += common_item.price;
          }
          const order_info: OrderInfo = {
            sent_time: new Date().toISOString(),
            status: OrderStatus.RECEIVED,
            scheduled_times: [new Date(Date.now() + 30 * 60000).toISOString()],
          };
          const best_shop: Cafe | null = await getBestShop();
          global_dispatch({type: 'SET_CURRENT_SHOP', payload: best_shop});
          if (global_state.current_user && global_state.current_shop) {
            console.log('sending order');
            const order_id: string = await sendOrder(
              ordered_items,
              total,
              order_info,
              global_state.current_shop,
              global_state.current_user,
            );
            console.log(order_id);
            setOrderId(order_id);
          }
        }}>
        <Text>Send Order</Text>
      </Pressable>
      <Text>{JSON.stringify(global_state.current_user?.current_order)}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
});
export default Root;
