import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../../theme';
import { Body, Heading } from '../../../typography';
import { RootRoutes } from '../../utils/types/navigation.types';
import { updateEndpoint } from '../../utils/helpers/notifications';
import { initiateStorage } from '../../utils/helpers/storage';

const { height, width } = Dimensions.get('window');
const widthDP = Platform.OS === 'android' ? width + 4 : width;
const heightDP = Platform.OS === 'android' ? height - 24 : height;

const SIZE = width * 0.75;

interface IntroPageProps {
  index: number;
  translateY: Animated.SharedValue<number>;
  title: string;
  key: string;
}

const IntroPage = (props: IntroPageProps) => {
  const navigation = useNavigation<RootRoutes>();
  const inputRange = [(-props.index - 1) * height, props.index * height, (props.index + 1) * height];
  const textBreathe = useSharedValue(1.5);
  const isIndexZero = props.index === 0;
  const isIndexOne = props.index === 1;
  const isIndexTwo = props.index === 2;

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(props.translateY.value, inputRange, [-1, 0.5, 2], Extrapolate.CLAMP);

    const borderRadius = interpolate(
      props.translateY.value,
      inputRange,
      [10, isIndexOne ? SIZE : 0, -5],
      Extrapolate.CLAMP,
    );
    const rotate = interpolate(
      props.translateY.value,
      inputRange,
      [isIndexOne ? 0 : -180, isIndexOne ? 180 : 45, 100],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(props.translateY.value, inputRange, [-3, 1, 0], Extrapolate.CLAMP);

    return {
      borderRadius,
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      opacity,
      width: isIndexOne ? SIZE * 2 : SIZE,
      height: isIndexOne ? SIZE * 0.45 : SIZE,
      backgroundColor: isIndexZero ? 'transparent' : isIndexOne ? 'transparent' : Colors.gold,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      props.translateY.value,
      inputRange,
      [isIndexTwo ? width * 10 : width, 0, -width * 1.3],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(props.translateY.value, inputRange, [-2, 1, -1], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ translateX: translateX }],
    };
  });
  const rBreatheTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withDelay(0, withRepeat(withTiming(textBreathe.value, { duration: 700 }), 0, true)),
        },
      ],
    };
  });

  const rPageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      props.translateY.value,
      inputRange,
      [isIndexOne ? width : width, 0, isIndexOne ? width : -width],
      Extrapolate.CLAMP,
    );
    const scale = interpolate(props.translateY.value, inputRange, [1, 1, 2], Extrapolate.CLAMP);
    return {
      transform: [{ translateX: translateX }, { scale }],
    };
  });

  useEffect(() => {
    textBreathe.value = 1.4;
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isIndexZero ? Colors.goldFaded1 : isIndexOne ? Colors.goldFaded2 : Colors.goldFaded3 },
        rPageStyle,
      ]}>
      <Animated.View style={[styles.square, rStyle]} />
      {/* <View style={styles.reverseSquare} /> */}
      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Heading
          size="large"
          weight={isIndexZero ? 'Extrabld' : isIndexOne ? 'Bold' : 'Black'}
          color={Colors.darkBrown}
          style={styles.text}>
          {props.title}
        </Heading>
      </Animated.View>
      {isIndexTwo ? (
        <Animated.View style={[styles.startButton, rBreatheTextStyle]}>
          <Pressable
            style={{ backgroundColor: 'red' }}
            onPress={async () => {
              await initiateStorage();
              navigation.navigate(CONST_SCREEN_SIGNUP);
            }}>
            <Body size="large" weight="Black" color={Colors.blue} style={styles.start}>
              let's go
            </Body>
          </Pressable>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthDP,
    height: heightDP,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  square: {
    backgroundColor: Colors.goldFaded2,
  },
  text: {
    textTransform: 'uppercase',
  },
  textContainer: { position: 'absolute' },
  startButton: {
    position: 'absolute',
    bottom: 250,
    textAlign: 'center',
    width: 100,
    height: 50,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  start: {
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  reverseSquare: {
    position: 'absolute',
    backgroundColor: Colors.goldFaded2,
    width: SIZE / 4,
    height: SIZE * 3,
    borderRadius: 10,
    transform: [{ rotate: '180deg' }],
  },
});

export { IntroPage };
