import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {BasketItem} from './BasketItem';
import {OrderingContext} from '../../../../contexts';

interface BasketPreviewProps {
  translateY?: Animated.SharedValue<number>;
}

export const BasketPreview = (props: BasketPreviewProps) => {
  const {ordering_state} = useContext(OrderingContext);
  return (
    <View style={styles.itemRow}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ordering_state.specific_basket.map((item, index) => {
          return <BasketItem key={index} item={item} />;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
