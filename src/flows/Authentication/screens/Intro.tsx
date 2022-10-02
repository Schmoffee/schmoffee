import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, useWindowDimensions, Pressable} from 'react-native';
import {Colors} from '../../../../theme';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
  useDerivedValue,
} from 'react-native-reanimated';
import {IntroPage} from '../../../components/Layouts/IntroPageLayout';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

interface IntroProps {}

export const Intro = (props: IntroProps) => {
  const WORDS = ['Welcome', 'to', 'Schmoffee'];
  const translateY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      pagingEnabled
      scrollEventThrottle={16}
      // horizontal
      style={styles.container}>
      {WORDS.map((title, index) => {
        return <IntroPage key={index.toString()} title={title} translateY={translateY} index={index} />;
      })}
      {/* <View style={styles.tapContainer}>
                <TouchableOpacity style={styles.rightTapContainer} onPress={() => handleNext()} />
                <TouchableOpacity style={styles.leftTapContainer} onPress={() => handlePrev()} />
            </View> */}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.goldFaded2,
  },
  // wordContainer: {
  //     height: 500,
  //     width: '100%',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  // },
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
