import React from 'react';
import {FlatList, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {OrderingContext} from '../../../../contexts';
import {useContext} from 'react';
import ShopCard from '../../components/shops/ShopCard';
import Map from '../../../common/components/Map/Map';
import {CARD_WIDTH, SPACING_FOR_CARD_INSET} from '../../../../../constants';

const CafeBrowsingPage = () => {
  const {ordering_state} = useContext(OrderingContext);

  return (
    <View style={styles.root}>
      <View style={styles.mapContainer}>
        <Map cafeIdFilter={null} cafeLocationFilter={undefined} />
      </View>
      <View style={styles.scrollViewContainer}>
        <SafeAreaView style={styles.flatListContainer}>
          <FlatList
            horizontal={true}
            pagingEnabled
            snapToInterval={CARD_WIDTH + 35}
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
            snapToAlignment="center"
            style={styles.scrollView}
            contentInset={{
              top: 0,
              left: SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET,
            }}
            contentContainerStyle={{
              paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
            }}
            data={ordering_state.cafes}
            renderItem={cafe => <ShopCard cafe={cafe.item} />}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapContainer: {
    position: 'absolute',
    flex: 1,
    zIndex: 1,
    elevation: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {},

  scrollViewContainer: {
    position: 'absolute',
    height: '25%',
    elevation: 5,
    zIndex: 2,
    bottom: 0,
  },
  flatListContainer: {
    height: '100%',
    width: '100%',
  },
  flatList: {
    width: '100%',
    height: '100%',
  },
});

export default CafeBrowsingPage;
