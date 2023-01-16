import React, { useMemo } from 'react';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { Colors, Spacings } from '../../../common/theme';
import { Body } from '../../../common/typography';
import { BasketPreview } from '../basket/BasketPreview';

// @ts-ignore
export const transformOrigin = ({ x, y }, ...transformations) => {
  'worklet';
  return [{ translateX: x }, { translateY: y }, ...transformations, { translateX: x * -1 }, { translateY: y * -1 }];
};

interface CustomHandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

const HOME_WIDTH = Dimensions.get('window').width;

const CustomHandle: React.FC<CustomHandleProps> = ({ style, animatedIndex }) => {
  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP),
  );
  //#endregion

  //#region styles
  const containerStyle = useMemo(() => [styles.header, style], [style]);

  const rBasketPreviewStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [0, 0.5], [1, 0], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [
        {
          translateX: interpolate(animatedIndex.value, [0, 0.5], [0, 100], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const rCartTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(animatedIndex.value, [0, 1], [0, HOME_WIDTH / 2 - 55], Extrapolate.CLAMP),
        },
        {
          scale: interpolate(animatedIndex.value, [0, 1], [1, 1.8], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const rContinueButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 0.2], [1, 0], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(animatedIndex.value, [0, 0.2], [0, 30], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[containerStyle]}
    // renderToHardwareTexureAndroid={true}
    >
      <Animated.Image
        source={require('../../../../assets/pngs/cart_continue.png')}
        style={[styles.continueContainer, rContinueButtonStyle]}
      />
      <View style={styles.basketPreviewContainer}>
        <Animated.View style={[styles.cartText, rCartTextStyle]}>
          <Body size="large" weight="Bold" color="white">
            Cart
          </Body>
        </Animated.View>
        <Animated.View style={[rBasketPreviewStyle]}>
          <BasketPreview />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default CustomHandle;

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.darkBrown,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight3,
    height: 100,
  },
  indicator: {
    position: 'absolute',
    width: 10,
    height: 4,
    backgroundColor: 'red',
  },
  basketPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacings.s5,
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s3,
  },
  cartText: {
    marginRight: Spacings.s3,
  },

  continueContainer: {
    position: 'absolute',
    right: -10,
    top: -84,
    resizeMode: 'contain',
    zIndex: -1,
  },
});
