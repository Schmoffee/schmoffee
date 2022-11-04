import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ShopHeader } from '../../../../components/WhatComponents/ShopHeader';
import { Footer } from '../../../../components/Footer/Footer';
import { CONST_SCREEN_WHEN } from '../../../../../constants';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { PreviewPage } from './PreviewPage';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const { height: wHeight, width: wWidth } = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const navigation = useNavigation<CoffeeRoutes>();
  const { ordering_state } = useContext(OrderingContext);
  const translateY = useSharedValue(0);
  const [query, setQuery] = useState('');

  const HOME_HEIGHT = useWindowDimensions().height;
  const anim2 = useSharedValue(0);

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

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = anim2.value;
      if (ctx.startY === 0) {
        ctx.startY = 1;
      }
    },
    onActive: (event, ctx) => {
      anim2.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      // console.log(event.translationY)
      console.log('anim value: ', anim2.value)
      console.log('event transalte y: ', event.translationY)

      if (event.translationY < 150) { //if the user swipes up
        anim2.value = withTiming(-(HOME_HEIGHT - 150)); //animate to the top

      } else if (event.translationY > 0) { //if the user swipes down
        anim2.value = withTiming(0); //close preview
      } else if (anim2.value < -200) { //if preview is open
        anim2.value = withTiming(-600); //KEEP PREVIEW OPEN
      }
      else if (anim2.value < 150) { //if preview is closed
        anim2.value = withTiming(HOME_HEIGHT / 9); //KEEP PREVIEW CLOSED
      }
    }

  });


  const landing_anim = useSharedValue(0);
  useEffect(() => {
    landing_anim.value = 0;
    landing_anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),

    });

  }, [ordering_state.specific_basket]);

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

  const rPageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: anim2.value + 20 }],
      // opacity: interpolate(anim2.value, [HOME_HEIGHT / 10, -HOME_HEIGHT], [1, 0]),
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
      borderRadius: 20,
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      hitSlop={{
        bottom: 20,
        // height: anim.value >= 104 ? 0 : HOME_HEIGHT / 2,

      }}
    >
      <Animated.View style={[rContainerStyle]}>
        <Animated.View style={[styles.itemsContainer, rPageStyle]}>
          <View style={styles.header}>
            <ShopHeader y={translateY} source={require('../../../../assets/pngs/shop.png')} />
            <Animated.View style={[styles.searchInputContainer, rSearchStyle]}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={query}
                onChangeText={queryText => setQuery(queryText)}
                placeholder="Search for an item"
              />
            </Animated.View>
          </View>
          <Animated.ScrollView style={[styles.itemsContainer, rListStyle]} onScroll={scrollHandler} scrollEventThrottle={16}>
            <View style={styles.container}>
              <CardSection query={query} title="Coffee" items={getCoffees()} />
              <CardSection title="Juices" items={getJuices()} />
              <CardSection title="Pastries" items={getPastries()} hideDivider />
            </View>
          </Animated.ScrollView>
        </Animated.View>

        <View style={styles.previewContainer}>
          <PreviewPage anim={anim2} />
        </View>
      </Animated.View>
    </PanGestureHandler >

  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    flex: 1,
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
    transform: [{ translateY: -500 }],
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
