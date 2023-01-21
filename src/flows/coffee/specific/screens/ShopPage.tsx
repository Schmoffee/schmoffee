import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Dimensions, NativeModules, Platform, StyleSheet, TextInput, View} from 'react-native';
import {OrderingContext} from '../../../../contexts';
import {Item} from '../../../../models';
import Animated, {Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Colors, Spacings} from '../../../common/theme';
import TabNavigator from '../../components/menu/TabNavigator';
import {BasketPreview} from '../../components/basket/BasketPreview';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';

const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const {height: wHeight, width: wWidth} = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const {ordering_state} = useContext(OrderingContext);
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
  }, [anim]);

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
  }, [basketAnim, ordering_state.specific_basket.length]);

  const contains = ({name}: Item, query: string) => {
    const nameLower = name.toLowerCase();
    return nameLower.includes(query);
  };
  const filtered_items = useMemo(() => {
    const formattedQuery = query.toLowerCase();
    return ordering_state.specific_items.filter(item => {
      return contains(item, formattedQuery);
    });
  }, [ordering_state.specific_items, query]);

  useEffect(() => {
    landing_anim.value = 0;
    landing_anim.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [landing_anim]);

  const getCoffees = () => {
    return filtered_items.filter(item => item.type === 'COFFEE');
  };
  const getJuices = () => {
    return filtered_items.filter(item => item.type === 'COLD_DRINKS');
  };
  const getPastries = () => {
    return filtered_items.filter(item => item.type === 'SNACKS');
  };

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
        </View>
      </View>
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
