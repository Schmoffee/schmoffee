import { Dimensions } from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const CARD_WIDTH = WIDTH * 0.8
export const CARD_HEIGHT = HEIGHT * 0.2;

export const SPACING_FOR_CARD_INSET = WIDTH * 0.1 - 10;

export default {
  window: {
    WIDTH,
    HEIGHT,
  },
  isSmallDevice: WIDTH < 375,
};
