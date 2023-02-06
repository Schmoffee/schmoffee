import {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts';
import {DataStore, SortDirection} from 'aws-amplify';
import {PastOrder} from '../../../models';
import React from 'react';
import {Text, View} from 'react-native';

const PastOrders = () => {
  const {global_state} = useContext(GlobalContext);
  const [past_orders, setPastOrders] = useState<PastOrder[]>(global_state.current_user?.past_orders || []);

  useEffect(() => {
    if (global_state.current_user) {
      const user_id = global_state.current_user.id;
      const subscription = DataStore.observeQuery(PastOrder, past_order => past_order.userID('eq', user_id), {
        sort: order => order.createdAt(SortDirection.ASCENDING),
      }).subscribe(snapshot => {
        const {items, isSynced} = snapshot;
        if (isSynced) {
          setPastOrders(items);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_state.current_user]);

  return (
    <View>
      {past_orders.map(order => (
        <View key={order.id}>
          <Text>{order.id}</Text>
        </View>
      ))}
    </View>
  );
};
