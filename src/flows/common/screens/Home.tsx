import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CurrentOrderBanner from '../../track/components/CurrentOrderBanner';
import { GlobalContext } from '../../../contexts';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { CONST_SCREEN_ORDER, CONST_SCREEN_SHOP, HEIGHT, WIDTH } from '../../../../constants';
import HoverButton from '../components/Buttons/HoverButton';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { SideDrawerContent } from '../../hamburger/components/SideDrawerContent';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import HamburgerIcon from '../../hamburger/components/HamburgerIcon';

export const Home = () => {
  const { global_state } = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const insets = useSafeAreaInsets();
  const anim = useSharedValue(0)

  useEffect(() => {
    if (global_state.current_order) {
      setCurrentVideo(2);
    } else {
      setCurrentVideo(0);
    }
  }, [global_state.current_order]);

  const handleShortButtonPress = () => {
    if (currentVideo === 0) {
      // setCurrentVideo(1);
      navigation.navigate(CONST_SCREEN_SHOP);
    } else if (currentVideo === 2) {
      navigation.navigate('TrackOrder', CONST_SCREEN_ORDER);
    }

  };

  const handleHamburgerPress = () => {
    console.log('hamburger pressed')
    console.log(anim.value)
    if (anim.value === 0) {
      anim.value = withTiming(195)
    }
    else {
      anim.value = withTiming(0)
    }
  }

  const handlePagePress = () => {
    if (anim.value !== 0) {
      anim.value = withTiming(0)
    }
  }


  return (
    <Pressable style={styles.root} onPress={handlePagePress}>
      <View style={styles.root}>
        <Pressable style={[styles.hamburgerButton]} onPress={handleHamburgerPress}>
          <HamburgerIcon />
        </Pressable>
        <SideDrawerContent anim={anim} />
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
            <View style={[styles.hoverButtonContainer, { top: insets.bottom + HEIGHT * 0.84 }]}>
              <HoverButton
                backgroundColor={currentVideo === 2 ? Colors.darkBlue : Colors.darkBrown}
                buttonPressedColor={currentVideo === 2 ? Colors.blueFaded : Colors.darkBrown2}
                onShortPressOut={() => handleShortButtonPress()}
                onLongPress={() => navigation.navigate('PreviewPage')}
              />
            </View>
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
        {/* <SideDrawerContent anim={anim} /> */}
      </View >
    </Pressable>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
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
});
