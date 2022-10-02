import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Dimensions, Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {CONST_SCREEN_SIGNUP} from '../../../constants';
import {Colors} from '../../../theme';
import {Body, Heading} from '../../../typography';
import {RootRoutes} from '../../utils/types/navigation.types';

const {height, width} = Dimensions.get('window');
const widthDP = Platform.OS === 'android' ? width + 4 : width;
const heightDP = Platform.OS === 'android' ? height - 24 : height;

const SIZE = width * 0.75;

interface IntroPageProps {
  index: number;
  translateY: Animated.SharedValue<number>;
  title: string;
}

const IntroPage = (props: IntroPageProps) => {
  const navigation = useNavigation<RootRoutes>();
  const inputRange = [(-props.index - 1) * height, props.index * height, (props.index + 1) * height];
  const textBreathe = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(props.translateY.value, inputRange, [-1, 0.5, 1], Extrapolate.CLAMP);

    const borderRadius = interpolate(props.translateY.value, inputRange, [10, SIZE / 2, -10], Extrapolate.CLAMP);

    return {
      borderRadius,
      transform: [{scale}],
      width: props.index === 1 ? SIZE : SIZE * 1.7,
      height: props.index === 1 ? SIZE / 2 : SIZE * 0.85,
      backgroundColor: props.index === 0 ? Colors.goldLight2 : props.index === 1 ? Colors.goldLight1 : Colors.gold,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const translateX = interpolate(props.translateY.value, inputRange, [width * 3, 0, -width], Extrapolate.CLAMP);

    const opacity = interpolate(props.translateY.value, inputRange, [-2, 1, -3], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{translateX: translateX}],
    };
  });
  const rBreatheTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withDelay(0, withRepeat(withTiming(textBreathe.value, {duration: 600}), 0, true)),
        },
      ],
    };
  });

  const rPageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      props.translateY.value,
      inputRange,
      [props.index === 1 ? width : width, 0, props.index === 1 ? width : -width],
      Extrapolate.CLAMP,
    );

    // const rotateY = interpolate(
    //     props.translateY.value,
    //     inputRange,
    //     [-1, 0, 1],
    //     Extrapolate.CLAMP
    // );

    return {
      transform: [{translateX: translateX}],
    };
  });

  useEffect(() => {
    textBreathe.value = 1.1;
  }, []);

  return (
    <Animated.View style={[styles.container, {backgroundColor: `rgba(202,162,108, 0.${props.index + 3})`}, rPageStyle]}>
      <Animated.View style={[styles.square, rStyle]} />
      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Heading size="large" weight="Black" color={Colors.darkBrown} style={styles.text}>
          {props.title}
        </Heading>
      </Animated.View>
      {props.index === 2 ? (
        <Animated.View style={[styles.startButton, rBreatheTextStyle]}>
          <TouchableOpacity onPress={() => navigation.navigate(CONST_SCREEN_SIGNUP)}>
            <Body size="large" weight="Black" color={Colors.blue} style={styles.start}>
              START
            </Body>
          </TouchableOpacity>
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
  },
  square: {
    backgroundColor: Colors.goldFaded,
  },
  text: {
    textTransform: 'uppercase',
  },
  textContainer: {position: 'absolute'},
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
});

export {IntroPage};
