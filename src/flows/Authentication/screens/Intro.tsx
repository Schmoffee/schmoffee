import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../../theme';
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import {IntroPage} from '../../../components/Layouts/IntroPageLayout';

export const Intro = () => {
  const WORDS = ['Welcome', 'to', 'Schmoffee'];
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      pagingEnabled
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      {WORDS.map((title, index) => {
        return <IntroPage key={index.toString()} title={title} translateY={translateY} index={index} />;
      })}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white2,
  },
  tapContainer: {
    position: 'absolute',
    height: '85%',
    width: '100%',
  },
  rightTapContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  leftTapContainer: {
    position: 'absolute',
    height: '100%',
    width: '25%',
  },
});
