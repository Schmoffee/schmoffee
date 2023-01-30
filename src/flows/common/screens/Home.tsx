import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, useWindowDimensions, View} from 'react-native';
import {HEIGHT, WIDTH, CONST_SCREEN_ORDER, CONST_SCREEN_SHOP} from '../../../../constants';
import {RootRoutes} from '../../../utils/types/navigation.types';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SideDrawerContent} from '../../hamburger/components/SideDrawerContent';
import Video from 'react-native-video';
import {PageLayout} from '../components/PageLayout';
import {GlobalContext} from '../../../contexts';
import CurrentOrderBanner from '../../track/components/CurrentOrderBanner';
import HoverButton from '../components/Buttons/LongPressButton';
import astronaut from '../../../assets/videos/astronaut.mp4';
import homeLoop from '../../../assets/videos/home-loop.mp4';
import flyComplete from '../../../assets/videos/fly-complete.mp4';

export const Home = () => {
  const {global_state} = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const HOME_WIDTH = useWindowDimensions().width;
  const [currentVideo, setCurrentVideo] = useState('home-loop.mp4');
  const [buttonPressed, setButtonPressed] = useState(false);
  // const anim = useSharedValue(0);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       anim.value = withTiming(0);
  //     };
  //   }, [anim]),
  // );
  // const gestureHandler = useAnimatedGestureHandler({
  //   onStart: (_, ctx) => {
  //     // @ts-ignore
  //     ctx.startX = anim.value;
  //     // @ts-ignore
  //     if (ctx.startX === 0) {
  //       // @ts-ignore
  //       ctx.startX = 1;
  //     }
  //   },
  //   onActive: (event, ctx) => {
  //     // @ts-ignore
  //     anim.value = ctx.startX + event.translationX;
  //   },
  //   onEnd: () => {
  //     if (anim.value > HOME_WIDTH / 9) {
  //       anim.value = withTiming(HOME_WIDTH / 2);
  //     } else if (anim.value < -(HOME_WIDTH / 6)) {
  //       anim.value = withTiming(HOME_WIDTH / 2);
  //     } else {
  //       anim.value = withTiming(0);
  //     }
  //   },
  // });
  // const rPageStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateX: anim.value}],
  //     opacity: interpolate(anim.value, [0, HOME_WIDTH / 2], [1, 0.7]),
  //   };
  // });
  // const rContainerStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: 1,
  //   };
  // });
  // const handlePagePress = () => {
  //   if (anim.value === 195) {
  //     anim.value = withTiming(0);
  //   }
  // };
  // const handleHamburgerPress = () => {
  //   if (anim.value === 0) {
  //     anim.value = withTiming(195);
  //   } else {
  //     anim.value = withTiming(0);
  //   }
  // };
  const onVideoEnd = () => {
    global_state.current_user?.current_order
      ? navigation.navigate('TrackOrder', CONST_SCREEN_ORDER)
      : navigation.navigate(CONST_SCREEN_SHOP);
    setCurrentVideo('astronaut.mp4');
  };

  const handlePress = () => {
    setCurrentVideo('fly-complete.mp4');
  };

  const getButtonText: () => string = () => {
    return global_state.current_user?.current_order ? 'Track my coffee' : 'Get me coffee';
  };
  return (
    // <PanGestureHandler
    //   onGestureEvent={gestureHandler}
    //   hitSlop={{
    //     left: 0,
    //     width: anim.value >= 194 ? 0 : HOME_WIDTH / 2,
    //   }}>
    <View style={styles.root}>
      <View>
        {/* <PageLayout
            hamburger

            header="SCHMOFFEE"
          // footer={{
          //   buttonDisabled: false,
          //   onPress: () => handlePress(),
          //   buttonText: getButtonText(),
          // }}
          > */}
        {/* <TapGesture /> */}
        {currentVideo !== 'fly-complete.mp4' && (
          <View style={styles.hoverButtonContainer}>
            <HoverButton
              onShortPressOut={() => handlePress()}
              onLongPress={
                currentVideo === 'astronaut.mp4'
                  ? () => navigation.navigate('TrackOrder')
                  : () => navigation.navigate('PreviewPage')
              }
            />
          </View>
        )}
        <Video
          source={
            currentVideo === 'home-loop.mp4' ? homeLoop : currentVideo === 'fly-complete.mp4' ? flyComplete : astronaut
          }
          style={styles.videoContainer}
          paused={false}
          resizeMode="stretch"
          repeat={currentVideo === 'fly-complete.mp4' ? false : true}
          onEnd={currentVideo === 'fly-complete.mp4' ? () => onVideoEnd() : () => {}}
        />
        {/* </PageLayout> */}
      </View>
      <View style={styles.currentOrderBanner}>
        {global_state.current_user?.current_order ? (
          <CurrentOrderBanner currentOrder={global_state.current_user.current_order} />
        ) : null}
      </View>
      {/* <SideDrawerContent anim={anim} /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },

  hoverButtonContainer: {
    position: 'absolute',
    top: HEIGHT / 1.17,
    left: WIDTH / 5,
    zIndex: 1,
  },

  videoContainer: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
  },
  currentOrderBanner: {
    position: 'absolute',
    top: HEIGHT / 1.5,
    left: WIDTH / 12,
  },
});
