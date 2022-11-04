import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, NativeModules, Dimensions, useWindowDimensions } from 'react-native';
import { Colors, Spacings } from '../../../../../theme';
import { CardSection } from '../../../../components/WhatComponents/CardSection';
import { OrderingContext } from '../../../../contexts';
import { Item } from '../../../../models';
import { CoffeeRoutes } from '../../../../utils/types/navigation.types';
import { BasketSection } from '../../../../components/Basket/BasketSection';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ShopHeader } from '../../../../components/WhatComponents/ShopHeader';
import { PreviewPage } from './PreviewPage';
import BottomSheet, { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import CustomHandle from '../../../../components/BottomSheet/CustomHandle';
import { Body, Heading } from '../../../../../typography';
import CustomBackdrop from '../../../../components/BottomSheet/CustomBackdrop';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const { height: wHeight, width: wWidth } = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const navigation = useNavigation<CoffeeRoutes>();
  const { ordering_state } = useContext(OrderingContext);
  const translateY = useSharedValue(0);
  const landing_anim = useSharedValue(0);
  const [query, setQuery] = useState('');

  const contains = ({ name }: Item, query: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes(query)) {
      return true;
    }
    return false;
  };
  const filtered_items = useMemo(() => {
    const formattedQuery = query.toLowerCase();
    const filteredData = ordering_state.specific_items.filter(item => {
      return contains(item, formattedQuery);
    });
    return filteredData;
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
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  })


  return (
    <View style={styles.root}>
      <View style={[styles.itemsContainer]}>
        <View style={styles.header}>
          <ShopHeader y={translateY} source={require('../../../../assets/pngs/shop.png')} />

          {/* <Animated.View style={[styles.searchInputContainer, rSearchStyle]}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={query}
                onChangeText={queryText => setQuery(queryText)}
                placeholder="Search for an item"
              />
            </Animated.View> */}

        </View>
        <Animated.ScrollView style={[styles.itemsContainer, rListStyle]} onScroll={scrollHandler} scrollEventThrottle={16}>
          <View style={styles.container}>
            <CardSection query={query} title="Coffee" items={getCoffees()} />
            <CardSection title="Juices" items={getJuices()} />
            <CardSection title="Pastries" items={getPastries()} hideDivider />
          </View>
        </Animated.ScrollView>
      </View>

      <View style={styles.bottomSheetContainer}>
        <BottomSheet
          index={ordering_state.specific_basket.length > 0 ? 0 : -1}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onClose={() => {
            bottomSheetRef.current?.close();
          }}
          animationConfigs={animationConfigs}
          backdropComponent={props => <CustomBackdrop {...props} />}
          handleComponent={props => <CustomHandle {...props} />}

        >
          <View style={styles.previewContainer}>
            <PreviewPage />
          </View>
        </BottomSheet>
      </View>
    </View >

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
  },
  itemsContainer: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchInputContainer: {
    backgroundColor: Colors.greyLight1,
    borderRadius: Spacings.s5,
    padding: Spacings.s2,
    marginHorizontal: Spacings.s4,
    position: 'absolute',
    top: 230,
    right: 5,
    width: 150,
    height: 50,
  },
  shopImage: {
    zIndex: -1,
  },
  previewContainer: {
    flex: 1,
  },
  bottomSheetContainer: {
    flex: 1,
    zIndex: 0,
    // backgroundColor: Colors.white,
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
});
