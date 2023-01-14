import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {Extrapolate, interpolate, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {OrderingContext} from '../../../../contexts';
import {BasketItem} from './BasketItem';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';

interface BasketSectionProps {
  translateY?: Animated.SharedValue<number>;
}

export const BasketSection = (props: BasketSectionProps) => {
  const {ordering_state} = useContext(OrderingContext);
  const translateY = useSharedValue(0) || props.translateY;
  const [closed, setClosed] = useState(false);

  const rHeaderStyle = useAnimatedStyle(() => ({
    // opacity: interpolate(translateY.value, [0, 100], [1, 0], Extrapolate.CLAMP),
  }));

  const rContainerStyle = useAnimatedStyle(() => ({
    opacity: closed ? 0 : interpolate(translateY.value, [0, 100], [1, 0], Extrapolate.CLAMP),

    transform: [
      {
        translateY: interpolate(translateY.value, [0, 155], [0, 55], Extrapolate.CLAMP),
      },
      {
        scale: interpolate(translateY.value, [0, 100], [1, 0.9], Extrapolate.CLAMP),
      },
    ],
    shadowOpacity: interpolate(translateY.value, [0, 30], [0.15, 0], Extrapolate.CLAMP),
  }));
  return (
    <Animated.View style={[styles.container, rContainerStyle]}>
      <Animated.View style={[styles.header, rHeaderStyle]}>
        <Body size="medium" weight="Bold">
          Basket
        </Body>
      </Animated.View>

      {ordering_state.specific_basket.length === 0 && (
        <View style={styles.emptyContainer}>
          <Body size="medium" weight="Bold" color={Colors.brown2}>
            Add some items to your basket!
          </Body>
        </View>
      )}
      <View style={styles.itemRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ordering_state.specific_basket.map((item, index) => {
            return <BasketItem key={index} item={item} />;
          })}
          {/* <View style={styles.addItemButton}>
                        <Body size="medium" weight="Bold" color={Colors.darkBrown2}>
                            +
                        </Body>
                    </View> */}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight1,
    marginVertical: Spacings.s2,
    height: 120,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacings.s5,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemButton: {
    backgroundColor: Colors.brownLight2,
    borderRadius: Spacings.s3,
    height: 40,
    width: 40,
    marginTop: Spacings.s4,
    marginLeft: Spacings.s2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
