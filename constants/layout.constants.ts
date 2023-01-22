import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CARD_WIDTH = width * 0.8
export const CARD_HEIGHT = height * 0.2;

export const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
