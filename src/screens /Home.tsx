import React, {useContext} from 'react';
import {View, Pressable, StyleSheet, Text} from 'react-native';
import {GlobalContext} from '../contexts';
import {getCommonItems} from '../utils/queries/datastore';
import LoadingPage from './LoadingPage';

const Home = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = React.useState(false);

  const getMeCoffee = async () => {
    setLoading(true);
    // Create a shop and one item
    const common_items = await getCommonItems();
    global_dispatch({type: 'SET_COMMON_ITEMS', payload: common_items});
    console.log(JSON.stringify(common_items, null, 2));
    // TODO Save the common items to the async storage
    // TODO Navigate to the What Page
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingPage />
      ) : (
        <Pressable
          onPress={() => getMeCoffee()}
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
      )}
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

export default Home;
