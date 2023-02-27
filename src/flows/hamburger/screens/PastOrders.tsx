import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts';
import { DataStore, SortDirection } from 'aws-amplify';
import { PastOrder } from '../../../models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../../common/components/PageLayout';
import { FlatList } from 'react-native-gesture-handler';

const PastOrders = () => {
  const { global_state } = useContext(GlobalContext);
  const [past_orders, setPastOrders] = useState<PastOrder[]>(global_state.current_user?.past_orders || []);

  useEffect(() => {
    if (global_state.current_user) {
      const user_id = global_state.current_user.id;
      const subscription = DataStore.observeQuery(PastOrder, past_order => past_order.userID('eq', user_id), {
        sort: order => order.createdAt(SortDirection.ASCENDING),
      }).subscribe(snapshot => {
        const { items, isSynced } = snapshot;
        if (isSynced) {
          setPastOrders(items);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [global_state.current_user]);

  return (
    <PageLayout
      header="Past Orders"

      backButton >
      <FlatList data={past_orders} renderItem={({ item }) => <Text>{item.id}</Text>} />

    </PageLayout >

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EDEBE7',
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',

    alignItems: 'center',
  },
});

export default PastOrders;
