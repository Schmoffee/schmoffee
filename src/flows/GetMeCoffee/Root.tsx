import React, {useContext, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GlobalContext} from '../../contexts';
import {getCommonItems} from '../../utils/queries/datastore';
import {DataStore, SortDirection} from 'aws-amplify';
import {Item} from '../../models';

/**
 * Top/Root level component of the "Get me Coffee" flow.
 * Where subscriptions and queries that need to be available to all screens in the flow are maintained.
 * @constructor
 */
const Root = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);

  /**
   * Get all the common items from the database and subscribe to any changes to them.
   */
  useEffect(() => {
    const subscription = DataStore.observeQuery(
      Item,
      item => item.is_common('eq', true),
      {
        sort: item => item.type(SortDirection.ASCENDING),
      },
    ).subscribe(snapshot => {
      const {items, isSynced} = snapshot;
      global_dispatch({type: 'SET_COMMON_ITEMS', payload: items});
      if (isSynced) {
        console.log('Synced');
      }
      console.log(
        'items: synced? ',
        isSynced,
        ' list: ',
        JSON.stringify(items, null, 2),
      );
    });
    return () => subscription.unsubscribe();
  }, [global_dispatch]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={async () => {
          const items = await getCommonItems();
          console.log('items: ', JSON.stringify(items, null, 2));
          console.log(global_state.common_items);
        }}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          },
          styles.wrapperCustom,
        ]}>
        {({pressed}) => (
          <Text style={styles.text}>
            {pressed ? 'Pressed!' : 'Get me coffee'}
          </Text>
        )}
      </Pressable>
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
