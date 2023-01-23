import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { HEIGHT, WIDTH, CONST_SCREEN_CAFES, CONST_SCREEN_ORDER, CONST_SCREEN_SHOP } from '../../../../../constants';
import { RootRoutes } from '../../../../utils/types/navigation.types';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SideDrawerContent } from '../../../hamburger/components/SideDrawerContent';
import Video from 'react-native-video';
import { PageLayout } from '../../../common/components/PageLayout';
import { GlobalContext } from '../../../../contexts';
import { CurrentOrderBanner } from '../../../track/components/CurrentOrderBanner';
import { Colors } from '../../../common/theme';

export const Home = () => {
  const { global_state } = useContext(GlobalContext);
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
      // @ts-ignore
      ctx.startX = anim.value;
      // @ts-ignore
      if (ctx.startX === 0) {
        // @ts-ignore
        ctx.startX = 1;
      }
    },
    onActive: (event, ctx) => {
      // @ts-ignore
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

  const handleNavigation = () => {
    console.log('handleNavigation');
    global_state.current_user?.order_running
      ? navigation.navigate('TrackOrder', CONST_SCREEN_ORDER)
      : navigation.navigate(CONST_SCREEN_SHOP);
  };

  const getButtonText: () => string = () => {
    return global_state.current_user?.order_running ? 'Track my coffee' : 'Get me coffee';
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
                onPress: () => handleNavigation(),
                buttonText: getButtonText(),
              }}>
              <Video
                source={require('../../../../assets/videos/home_animation.mp4')}
                style={styles.videoContainer}
                paused={false}
                resizeMode="cover"
                repeat={true}
              />
            </PageLayout>
          </Animated.View>
        </Pressable>

        <View style={styles.currentOrderBanner}>
          <CurrentOrderBanner />

        </View>

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
  currentOrderBanner: {
    position: 'absolute',
    top: HEIGHT / 1.5,
    left: WIDTH / 12,

  },
});
