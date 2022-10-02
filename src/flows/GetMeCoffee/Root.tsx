import React, {useContext, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GlobalContext} from '../../contexts';
import {getCommonItems} from '../../utils/queries/datastore';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item} from '../../models';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoffeeRoutes} from '../../utils/types/navigation.types';
import {Home} from './screens/Home';
import {PreviewPage} from './screens/PreviewPage';
import {WhatPage} from './screens/WhatPage';
import {WhenPage} from './screens/WhenPage';

/**
 * Top/Root level component of the "Get me Coffee" flow.
 * Where subscriptions and queries that need to be available to all screens in the flow are maintained.
 * @constructor
 */
const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const CoffeeStack = createNativeStackNavigator<CoffeeRoutes>();

  /**
   * Get all the common items from the database and subscribe to any changes to them.
   */
  useEffect(() => {
    const subscription = DataStore.observeQuery(Item, item => item.is_common('eq', true), {
      sort: item => item.type(SortDirection.ASCENDING),
    }).subscribe(snapshot => {
      const {items, isSynced} = snapshot;
      global_dispatch({type: 'SET_COMMON_ITEMS', payload: items});
      if (isSynced) {
        console.log('Synced');
      }
      console.log('items: synced? ', isSynced, ' list: ', JSON.stringify(items, null, 2));
    });
    return () => subscription.unsubscribe();
  }, [global_dispatch]);

  return (
    <CoffeeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <CoffeeStack.Screen name="Home" component={Home} />
      <CoffeeStack.Screen name="WhatPage" component={WhatPage} />
      <CoffeeStack.Screen name="WhenPage" component={WhenPage} />
      <CoffeeStack.Screen name="PreviewPage" component={PreviewPage} />
    </CoffeeStack.Navigator>
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
