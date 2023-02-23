import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CurrentOrderBanner from '../../track/components/CurrentOrderBanner';
import { GlobalContext } from '../../../contexts';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { CONST_SCREEN_ORDER, CONST_SCREEN_SHOP, HEIGHT, WIDTH } from '../../../../constants';
import HoverButton from '../components/Buttons/HoverButton';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { getCurrOrder } from '../../../utils/queries/datastore';

export const Home = () => {
  const { global_state } = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (global_state.current_order) {
      setCurrentVideo(2);
    } else {
      setCurrentVideo(0);
    }
  }, [global_state.current_order]);

  const handlePress = () => {
    if (currentVideo === 0) {
      // setCurrentVideo(1);
      navigation.navigate(CONST_SCREEN_SHOP);
    } else if (currentVideo === 2) {
      navigation.navigate('TrackOrder', CONST_SCREEN_ORDER);
    }
  };

  return (
    <View style={styles.root}>
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
              onShortPressOut={() => handlePress()}
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
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
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
