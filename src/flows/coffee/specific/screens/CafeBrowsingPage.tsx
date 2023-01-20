import React from 'react';
import {FlatList, View} from 'react-native';
import {OrderingContext} from '../../../../contexts';
import {useContext} from 'react';
import ShopCard from '../../components/shops/ShopCard';
import Map from '../../../common/components/Map';

const CafeBrowsingPage = () => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);

  return (
    <View style={{flex: 1}}>
      <View style={{display: 'flex', flex: 1}}>
        <Map cafeIdFilter={null} />
      </View>
      <FlatList data={ordering_state.cafes} renderItem={cafe => <ShopCard cafe={cafe.item} />} horizontal={true} />
    </View>
  );
};

export default CafeBrowsingPage;
