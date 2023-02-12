import React, { useContext, useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BasketItem } from '../../../common/components/Items/BasketItem';
import { OrderingContext } from '../../../../contexts';
import { Body } from '../../../common/typography';
import { Colors, Spacings } from '../../../common/theme';
import { useNavigation } from '@react-navigation/native';
import FullOrderItem from '../../../common/components/Items/FullOrderItem';

interface BasketPreviewProps {
  translateY?: Animated.SharedValue<number>;
}

export const BasketPreview = (props: BasketPreviewProps) => {
  const { ordering_state } = useContext(OrderingContext);
  const navigation = useNavigation();

  //  loop animation
  const anim = useSharedValue(1);
  useEffect(() => {
    anim.value = 0;
    anim.value = withDelay(1500, withRepeat(withTiming(1, { duration: 700 }), -1, true));
  }, [anim]);

  const rChevronStyle = useAnimatedStyle(() => {
    const scale = interpolate(anim.value, [0, 1], [1, 1]);
    const translateX = interpolate(anim.value, [0, 1], [0, 1.7], Extrapolate.CLAMP);
    return {
      transform: [{ scale }, { translateX }],
    };
  }, []);

  return (
    <View style={styles.itemRow}>
      <View style={styles.cartIcon}>
        <Image source={require('../../../../assets/pngs/cart.png')} style={{ width: 35, height: 35, tintColor: Colors.white }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ordering_state.specific_basket.map((item, index) => {
          return <BasketItem item={item} key={item.id + index} />;
        })}
      </ScrollView>
      <Pressable style={styles.circle} onPress={() => navigation.navigate('PreviewPage')}>
        <Animated.View style={[rChevronStyle]}>
          <Image source={require('../../../../assets/pngs/right_chevron.png')} style={[styles.rightChevron]} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s4,
    position: 'relative',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacings.s1,
  },
  cartIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: Spacings.s1,
  },

  rightChevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    justifyContent: 'center',
  },
});
