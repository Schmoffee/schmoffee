import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CurrentOrderBanner from '../../track/components/CurrentOrderBanner';
import {GlobalContext} from '../../../contexts';
import {RootRoutes} from '../../../utils/types/navigation.types';
import {CONST_SCREEN_CAFES, CONST_SCREEN_ORDER, CONST_SCREEN_SHOP, HEIGHT, WIDTH} from '../../../../constants';
import HoverButton from '../components/Buttons/HoverButton';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../theme';
import {SideDrawerContent} from '../../hamburger/components/SideDrawerContent';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import HamburgerIcon from '../../hamburger/components/HamburgerIcon';
import NetworkBanner from '../components/Banners/NetworkBanner';

export const Home = () => {
  const {global_state} = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const insets = useSafeAreaInsets();
  const hamburgerAnim = useSharedValue(0);
  const networkAnim = useSharedValue(0);
  const buttonBreathe = useSharedValue(1.5);

  useEffect(() => {
    if (global_state.network_status) {
      networkAnim.value = withTiming(0, {duration: 100});
    } else {
      networkAnim.value = withTiming(HEIGHT * 0.02, {duration: 300});
    }
  }, [global_state.network_status, networkAnim]);

  const handleShortButtonPress = () => {
    if (global_state.current_order) {
      navigation.navigate('TrackOrder', CONST_SCREEN_ORDER);
    } else {
      navigation.navigate(CONST_SCREEN_CAFES);
    }
  };

  const handleLongButtonPress = () => {
    if (currentVideo === 0) {
      navigation.navigate('PreviewPage');
    } else if (currentVideo === 2) {
      navigation.navigate('TrackOrder', CONST_SCREEN_ORDER);
    }
  };

  const handleHamburgerPress = () => {
    if (hamburgerAnim.value === 0) {
      hamburgerAnim.value = withTiming(195);
    } else {
      hamburgerAnim.value = withTiming(0);
    }
  };

  const handlePagePress = () => {
    if (hamburgerAnim.value !== 0) {
      hamburgerAnim.value = withTiming(0);
    }
  };

  const rNetworkBannerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: networkAnim.value}],
    };
  });

  const rBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(hamburgerAnim.value, [0, 195], [0, 1]),
    };
  });

  const rHoverButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withDelay(20, withRepeat(withTiming(-5, {duration: 2000}), -1, true))}],
    };
  });

  return (
    <Pressable style={styles.root} onPress={handlePagePress}>
      <View style={styles.root}>
        {global_state.network_status ? null : (
          <Animated.View style={[styles.networkStatusContainer, rNetworkBannerStyle]}>
            <NetworkBanner />
          </Animated.View>
        )}
        <Pressable style={[styles.hamburgerButton]} onPress={handleHamburgerPress}>
          <HamburgerIcon />
        </Pressable>
        <SideDrawerContent anim={hamburgerAnim} />
        <View style={styles.bgStill}>
          <FastImage
            source={
              currentVideo === 0
                ? require('../../../assets/pngs/home-image.png')
                : require('../../../assets/pngs/cream-still.png')
            }
          />
        </View>
        <View>
          {currentVideo !== 1 ? (
            <Animated.View
              style={[styles.hoverButtonContainer, {top: insets.bottom + HEIGHT * 0.84}, rHoverButtonStyle]}>
              <HoverButton
                backgroundColor={currentVideo === 2 ? Colors.darkBlue : Colors.darkBrown}
                buttonPressedColor={currentVideo === 2 ? Colors.blueFaded : Colors.darkBrown2}
                onShortPressOut={() => handleShortButtonPress()}
                onLongPress={() => handleLongButtonPress()}
              />
            </Animated.View>
          ) : null}
          <FastImage
            source={
              global_state.current_order
                ? require('../../../assets/gifs/astronaut.gif')
                : currentVideo === 1
                ? require('../../../assets/gifs/fly-complete.gif')
                : require('../../../assets/gifs/home-loop.gif')
            }
            onLoad={() => {
              if (currentVideo === 1) {
                setTimeout(() => {
                  navigation.navigate(CONST_SCREEN_SHOP);
                }, 2700);
              }
            }}
            style={styles.videoContainer}
          />
        </View>
        <View style={styles.currentOrderBanner}>
          <CurrentOrderBanner />
        </View>
        {/* <Animated.View style={[styles.blurView, rBlurStyle]}>
          <BlurView blurType='dark' blurAmount={40} />
        </Animated.View> */}
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  networkStatusContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },

  hamburgerButton: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  sideDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 2,
  },
  bgStill: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    zIndex: 0,
  },

  hoverButtonContainer: {
    position: 'absolute',
    left: WIDTH / 5.5,
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
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
    height: HEIGHT,
    width: WIDTH,
  },
});
