import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dimensions, NativeModules, Platform, StyleSheet, TextInput, View } from 'react-native';
import { OrderingContext } from '../../../../contexts';
import { Item } from '../../../../models';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PreviewPage } from './PreviewPage';
import BottomSheet from '@gorhom/bottom-sheet';
import { CardSection } from '../../components/menu/CardSection';
import { Heading } from '../../../common/typography';
import CustomBackdrop from '../../components/preview/CustomBackdrop';
import { Colors, Spacings } from '../../../common/theme';
import CustomHandle from '../../components/preview/CustomHandle';
import TabNavigator from '../../components/menu/TabNavigator';
import ShopHeader from '../../components/ShopHeader';
import { useNavigation } from '@react-navigation/native';
import { BasketPreview } from '../../components/basket/BasketPreview';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const { height: wHeight, width: wWidth } = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const navigation = useNavigation();
  const { ordering_state } = useContext(OrderingContext);
  const translateY = useSharedValue(0);
  const landing_anim = useSharedValue(0);
  const [query, setQuery] = useState('');
  const anim = useSharedValue(0);
  const basketAnim = useSharedValue(0);

  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  useEffect(() => {

    if (ordering_state.specific_basket.length === 0) {
      // basketAnim.value = 1;
      basketAnim.value = withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
    if (ordering_state.specific_basket.length > 0) {
      basketAnim.value = 1;
      basketAnim.value = withTiming(1, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }

  }, [ordering_state.specific_basket.length]);


  const contains = ({ name }: Item, query: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes(query)) {
      return true;
    }
    return false;
  };
  const filtered_items = useMemo(() => {
    const formattedQuery = query.toLowerCase();
    return ordering_state.specific_items.filter(item => {
      return contains(item, formattedQuery);
    });
  }, [ordering_state.specific_items, query]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  useEffect(() => {
    landing_anim.value = 0;
    landing_anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  useEffect(() => {
    if (ordering_state.specific_basket.length === 0) {
      bottomSheetRef.current?.snapToPosition(0);
    }
  }, [ordering_state]);

  const getCoffees = () => {
    return filtered_items.filter(item => item.type === 'COFFEE');
  };
  const getJuices = () => {
    return filtered_items.filter(item => item.type === 'COLD_DRINKS');
  };
  const getPastries = () => {
    return filtered_items.filter(item => item.type === 'SNACKS');
  };

  const rListStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value * 0.5,
      transform: [
        {
          translateY: interpolate(landing_anim.value, [0, 1], [-150, 0]),
        },
      ],
    }),
    [],
  );

  const rSearchStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(translateY.value, [100, 0], [-100, -20], Extrapolate.CLAMP),
        },
      ],
    }),
    [],
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['14%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  // const animationConfigs = useBottomSheetSpringConfigs({
  //   damping: 80,
  //   overshootClamping: true,
  //   restDisplacementThreshold: 0.1,
  //   restSpeedThreshold: 0.1,
  //   stiffness: 500,
  // })

  const rCircleStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value,
      transform: [
        {
          scale: interpolate(anim.value, [0, 1], [0, 1]),
        },
      ],
    }),
    [],
  );

  const rBasketOpenStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value,
      transform: [
        {
          translateY: interpolate(basketAnim.value, [0, 1], [110, 0]),
        },
      ],
    }),
    [],
  );

  // const rBasketClosedStyle = useAnimatedStyle(
  //   () => ({
  //     // opacity: anim.value,
  //     transform: [
  //       {
  //         translateY: interpolate(basketAnim.value, [0, 1], [0, 100]),
  //       },
  //     ],
  //   }),
  //   [],
  // );



  return (
    <View style={styles.root}>
      {/* back button for navigation */}
      <View style={styles.button}>
        <LeftChevronBackButton />
      </View>

      <View style={[styles.itemsContainer]}>
        <View style={styles.header}>
          <Animated.Image
            source={require('../../../../assets/pngs/semi-circle.png')}
            style={[styles.semiCircle, rCircleStyle]}
          />
          <Animated.View style={[styles.searchInputContainer]}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={query}
              onChangeText={queryText => setQuery(queryText)}
              placeholder="What do you crave?"
            />
          </Animated.View>
          <TabNavigator tab1={getCoffees()} tab2={getJuices()} tab3={getPastries()} />
          {/* <Heading size="default" weight="Extrabld" color={Colors.white}>
            COFFEEe
          </Heading> */}
          {/* <ShopHeader y={translateY} source={require('../../../../assets/pngs/shop.png')} /> */}
        </View>
        {/* <Animated.ScrollView */}
        {/* style={[styles.itemsContainer, rListStyle]}
          onScroll={scrollHandler}
          scrollEventThrottle={16}>
          <View style={styles.container}>
            <CardSection query={query} items={getCoffees()} />
            {/* <CardSection items={getJuices()} /> */}
        {/* <CardSection items={getPastries()} hideDivider /> */}
        {/* </View> */}
        {/* </Animated.ScrollView> */}
      </View>

      {/* <View style={styles.bottomSheetContainer}>
        <BottomSheet
          index={ordering_state.specific_basket.length > 0 ? 0 : -1}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          style={styles.bottomSheet}
          onClose={() => {
            bottomSheetRef.current?.close();
          }}
          backdropComponent={props => <CustomBackdrop {...props} />}
          handleComponent={props => <CustomHandle {...props} />}>

          <View style={styles.previewContainer}>
            <PreviewPage />
          </View>
        </BottomSheet>
      </View> */}

      <Animated.View style={[styles.basketContainer, rBasketOpenStyle]}>
        <BasketPreview />
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  container: {
    marginTop: 160,
    paddingTop: 70,
    paddingBottom: 70,
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.red,
  },
  itemsContainer: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.greyLight1,
  },
  basketContainer: {
    position: 'absolute',
    bottom: -5,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    borderBottomColor: Colors.greyLight2,
    backgroundColor: Colors.darkBrown,
    borderTopRightRadius: 60,
    borderTopLeftRadius: 60,


  },

  searchInputContainer: {
    backgroundColor: Colors.greyLight1,
    borderRadius: Spacings.s5,
    padding: Spacings.s2,
    marginBottom: Spacings.s4,
    minWidth: '50%',
  },
  shopImage: {
    zIndex: -1,
  },
  previewContainer: {
    flex: 1,
  },
  bottomSheetContainer: {
    flex: 1,
    zIndex: 1,
    // height: 300,
    // backgroundColor: Colors.red,
  },
  bottomSheet: {
    backgroundColor: Colors.blue,
    // zIndex: 1,
    // height: '100%',
  },

  semiCircle: {
    zIndex: -1,
    position: 'absolute',
    top: -450,
  },

  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    width: '100%',
    height: 100,
    backgroundColor: Colors.greyLight1,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    marginHorizontal: Spacings.s9,
  },
  button: {
    position: 'absolute',
    top: 20,
    left: 0,
    zIndex: 1,
  },

});
