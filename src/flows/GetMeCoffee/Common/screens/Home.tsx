import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { CONST_SCREEN_SHOP } from '../../../../../constants';
import { PageLayout } from '../../../../components/Layouts/PageLayout';
import { RootRoutes } from '../../../../utils/types/navigation.types';
import { GlobalContext, OrderingContext } from '../../../../contexts';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SideDrawerContent } from '../../../../components/HamburgerMenu/SideDrawerContent';
import Video from 'react-native-video';
// import video from '../../../../assets/videos/home_animation.mp4';

export const Home = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const navigation = useNavigation<RootRoutes>();
  const HOME_WIDTH = useWindowDimensions().width;
  const anim = useSharedValue(0);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        anim.value = withTiming(0);
      };
    }, [anim]),
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = anim.value;
      if (ctx.startX === 0) {
        ctx.startX = 1;
      }
    },
    onActive: (event, ctx) => {
      anim.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      if (anim.value > HOME_WIDTH / 9) {
        anim.value = withTiming(HOME_WIDTH / 2);
      } else if (anim.value < -(HOME_WIDTH / 6)) {
        anim.value = withTiming(HOME_WIDTH / 2);
      } else {
        anim.value = withTiming(0);
      }
    },
  });

  const rPageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: anim.value }],
      opacity: interpolate(anim.value, [0, HOME_WIDTH / 2], [1, 0.7]),
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const handlePagePress = () => {
    if (anim.value === 195) {
      anim.value = withTiming(0);
    }
  };

  const handleHamburgerPress = () => {
    if (anim.value === 0) {
      anim.value = withTiming(195);
    } else {
      anim.value = withTiming(0);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      hitSlop={{
        left: 0,
        width: anim.value >= 194 ? 0 : HOME_WIDTH / 2,
      }}>

      <Animated.View style={rContainerStyle}>
        <Pressable onPressOut={handlePagePress}>
          <Animated.View style={rPageStyle}>
            <PageLayout
              hamburger
              hamburgerOnPress={handleHamburgerPress}
              header="SCHMOFFEE"
              footer={{
                buttonDisabled: false,
                onPress: () => navigation.navigate(CONST_SCREEN_SHOP),
                buttonText: 'Get me coffee',
              }}
            >

              <Video source={require('../../../../assets/videos/home_animation.mp4')}
                style={styles.videoContainer}
                paused={false}
                resizeMode="cover"
                repeat={true}
              />


            </PageLayout>
          </Animated.View>
        </Pressable>


        <SideDrawerContent anim={anim} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: -270,
    left: -90,
  },
});
