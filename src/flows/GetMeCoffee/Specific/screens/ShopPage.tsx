import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, NativeModules, Dimensions } from 'react-native';
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ShopHeader } from '../../../../components/WhatComponents/ShopHeader';
import { Footer } from '../../../../components/Footer/Footer';
import { CONST_SCREEN_WHEN } from '../../../../../constants';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const { height: wHeight, width: wWidth } = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const navigation = useNavigation<CoffeeRoutes>();
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const translateY = useSharedValue(0);
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
  }, [ordering_state.specific_items, query])

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);


  const getCoffees = () => {
    return filtered_items.filter(item => item.type === 'COFFEE');
  };
  const getJuices = () => {
    return filtered_items.filter(item => item.type === 'COLD_DRINKS');
  };
  const getPastries = () => {
    return filtered_items.filter(item => item.type === 'SNACKS');
  };



  const pageStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value * 0.5,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-150, 0]),
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

  return (
    <View style={styles.root}>
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
      <Animated.ScrollView style={pageStyle} onScroll={scrollHandler} scrollEventThrottle={16}>
        <View style={styles.container}>
          <CardSection query={query} title="Coffee" items={getCoffees()} />
          <CardSection title="Juices" items={getJuices()} />
          <CardSection title="Pastries" items={getPastries()} hideDivider />
        </View>
      </Animated.ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <Footer
            buttonDisabled={ordering_state.specific_basket.length === 0}
            onPress={() => navigation.navigate(CONST_SCREEN_WHEN)}
            buttonText="Continue"
            type="basket"
            children={<BasketSection translateY={translateY} />}
          />
        </View>
      </View>
    </View>
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