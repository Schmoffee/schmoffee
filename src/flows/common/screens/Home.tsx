import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import CurrentOrderBanner from '../../track/components/CurrentOrderBanner';
import { GlobalContext } from '../../../contexts';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { CONST_SCREEN_ORDER, CONST_SCREEN_SHOP, HEIGHT, WIDTH } from '../../../../constants';
import HoverButton from '../components/Buttons/LongPressButton';

export const Home = () => {
  const { global_state } = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  console.log('currentVideo', currentVideo);
  const [orderRunningn, setOrderRunning] = useState<boolean>(false);

  const onVideoEnd = () => {
    global_state.current_user?.current_order
      ? navigation.navigate('TrackOrder', CONST_SCREEN_ORDER)
      : navigation.navigate(CONST_SCREEN_SHOP);
    setCurrentVideo(2);
  };

  const handlePress = () => {
    setCurrentVideo(1);
  };

  return (
    <View style={styles.root}>
      <View>
        {currentVideo === 0 ? (
          <View style={styles.hoverButtonContainer}>
            <HoverButton
              onShortPressOut={() => handlePress()}
              onLongPress={
                currentVideo === 2 ? () => navigation.navigate('TrackOrder') : () => navigation.navigate('PreviewPage')
              }
            />
          </View>
        ) : null}
        <Video
          source={
            currentVideo === 0
              ? require('../../../assets/videos/home-loop.mp4')
              : currentVideo === 1
                ? require('../../../assets/videos/fly-complete-2.mp4')
                : require('../../../assets/videos/astronaut.mp4')
          }
          style={styles.videoContainer}
          paused={false}
          resizeMode="stretch"
          repeat={currentVideo !== 1}
          onEnd={currentVideo === 1 ? () => onVideoEnd() : () => { }}
        />
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
