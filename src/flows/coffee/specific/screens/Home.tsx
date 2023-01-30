import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HEIGHT, WIDTH, CONST_SCREEN_ORDER, CONST_SCREEN_SHOP } from '../../../../../constants';
import { RootRoutes } from '../../../../utils/types/navigation.types';
import Video from 'react-native-video';
import { GlobalContext } from '../../../../contexts';
import HoverButton from '../../../common/components/Buttons/LongPressButton';
import astronaut from '../../../../assets/videos/astronaut.mp4'
import homeLoop from '../../../../assets/videos/home-loop.mp4';
import flyComplete from '../../../../assets/videos/fly-complete.mp4';

export const Home = () => {
  const { global_state } = useContext(GlobalContext);
  const navigation = useNavigation<RootRoutes>();
  const [currentVideo, setCurrentVideo] = useState("home-loop.mp4");
  const [buttonPressed, setButtonPressed] = useState(false);

  const onVideoEnd = () => {
    global_state.current_user?.order_running
      ? navigation.navigate('TrackOrder', CONST_SCREEN_ORDER)
      : navigation.navigate(CONST_SCREEN_SHOP);
    setCurrentVideo('astronaut.mp4');

  };

  const handlePress = () => {
    setCurrentVideo('fly-complete.mp4');
  };

  return (
    <View style={styles.root}>
      <View>
        {currentVideo !== "fly-complete.mp4" &&
          <View style={styles.hoverButtonContainer}>
            <HoverButton onShortPressOut={() => handlePress()} onLongPress={currentVideo === "astronaut.mp4" ? () => navigation.navigate('TrackOrder') : () => navigation.navigate('PreviewPage')} />
          </View>
        }
        <Video
          source={currentVideo === "home-loop.mp4" ? homeLoop : currentVideo === "fly-complete.mp4" ? flyComplete : astronaut}
          style={styles.videoContainer}
          paused={false}
          resizeMode="stretch"
          repeat={currentVideo === "fly-complete.mp4" ? false : true}
          onEnd={currentVideo === "fly-complete.mp4" ? () => onVideoEnd() : () => { }}
        />
      </View>
      <View style={styles.currentOrderBanner}>
        {/* <CurrentOrderBanner /> */}
      </View>
      {/* <SideDrawerContent anim={anim} /> */}
    </View >
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
