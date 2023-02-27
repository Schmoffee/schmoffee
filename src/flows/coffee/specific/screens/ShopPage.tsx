import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, NativeModules, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { OrderingContext } from '../../../../contexts';
import { Cafe, Item } from '../../../../models';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacings } from '../../../common/theme';
import TabNavigator from '../../components/menu/TabNavigator';
import { BasketPreview } from '../../components/basket/BasketPreview';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';
import LinearGradient from 'react-native-linear-gradient';
import useKeyboardVisible from '../../../../utils/helpers/others';
import ReusableBanner from '../../../common/components/Banners/ReusableBanner';
import NetworkBanner from '../../../common/components/Banners/NetworkBanner';
import { BlurView } from '@react-native-community/blur';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBarManager.HEIGHT;

const { height: wHeight, width: wWidth } = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;

export const ShopPage = () => {
  const isKeyboardVisible = useKeyboardVisible();
  const { ordering_state } = useContext(OrderingContext);
  const landing_anim = useSharedValue(0);
  const [query, setQuery] = useState('');
  const anim = useSharedValue(0);
  const basketAnim = useSharedValue(0);
  const searchAnim = useSharedValue(0);
  const cafe = useMemo(
    () => ordering_state.cafes.find((c: Cafe) => c.id === ordering_state.current_shop_id),
    [ordering_state.current_shop_id, ordering_state.cafes],
  );

  console.log(isKeyboardVisible)
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
    if (ordering_state.specific_basket.length > 0 && basketAnim.value === 0) {
      basketAnim.value = withTiming(1, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [basketAnim, ordering_state.specific_basket.length]);


  const contains = ({ name }: Item, query: string) => {
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

  const handleSearchPress = () => {
    if (searchAnim.value === 0) {
      searchAnim.value = withTiming(1, {
        duration: 900,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      searchAnim.value = withTiming(0, {
        duration: 950,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setQuery('');
    }
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

  const rSearchContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(searchAnim.value, [0, 1], [Colors.darkBrown, Colors.greyLight1]);
    return {
      width: interpolate(searchAnim.value, [0, 1], [25, 330]),
      backgroundColor,
    };
  });
  [];
  const rSearchIconStyle = useAnimatedStyle(() => {
    let rotate = interpolate(searchAnim.value, [0, 1], [0, -360], Extrapolate.CLAMP);
    const tintColor = interpolateColor(searchAnim.value, [0, 1], [Colors.greyLight3, Colors.darkBrown]);
    return {
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
      tintColor,
      backgroundColor: 'transparent',
    };
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.backButton}>
          <LeftChevronBackButton color={Colors.white} />
        </View>
        <View style={[styles.itemsContainer]}>
          <LinearGradient locations={[0.2, 1]} colors={[Colors.darkBrown2, Colors.cream]}>
            <View style={styles.header}>
              <Animated.Image
                source={require('../../../../assets/pngs/semi-circle.png')}
                style={[styles.semiCircle, rCircleStyle]}
              />
              <Animated.View style={[styles.searchInputContainer, rSearchContainerStyle]}>
                <View style={styles.searchIcon}>
                  <Pressable onPress={handleSearchPress}>
                    <Animated.Image
                      style={rSearchIconStyle}
                      source={require('../../../../assets/pngs/magnifyingglass.png')}
                    />
                  </Pressable>
                </View>
                <Animated.View style={[styles.searchText]}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={query}
                    onChangeText={queryText => setQuery(queryText)}
                    placeholder="What do you crave?"
                    style={styles.searchText}
                    placeholderTextColor={Colors.darkBrown}
                    selectionColor={Colors.darkBrown}
                  />
                </Animated.View>
                <View style={styles.clearIcon}>
                  <Pressable onPress={handleSearchPress}>
                    <Animated.Image
                      style={[rSearchIconStyle, { width: 15, height: 15 }]}
                      source={require('../../../../assets/pngs/x-outline.png')}
                    />
                  </Pressable>
                </View>
              </Animated.View>
              <TabNavigator tab1={getCoffees()} tab2={getJuices()} tab3={getPastries()} query={query} />
            </View>
          </LinearGradient>
        </View>
        <Animated.View style={[styles.basketContainer, rBasketOpenStyle]}>
          <BasketPreview />
        </Animated.View>
        {cafe?.is_open ? (
          <View style={styles.banner}>
            <ReusableBanner text="This cafe is currently closed" color={Colors.greyLight3} />
            <BlurView style={styles.blurView} />
          </View>
        ) : null}


      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // zIndex: 1,
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
    // justifyContent: 'center',
    alignItems: 'center',
  },
  itemsContainer: {
    // flex: 1,
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: '102%',
  },
  basketContainer: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 0,
    height: '13%',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    borderBottomColor: Colors.greyLight2,
    backgroundColor: Colors.darkBrown,
    borderTopRightRadius: 60,
    borderTopLeftRadius: 60,
    shadowColor: '#000000',
    shadowOffset: {
      width: 30,
      height: 3,
    },
    shadowRadius: 35,
    shadowOpacity: 0.9,
    elevation: 5,
    zIndex: 1,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: '8.5%',
    right: '5%',
    alignItems: 'center',
    paddingHorizontal: Spacings.s2,
    elevation: 2,
    zIndex: 2,
    width: 330,
  },
  searchIcon: {
    position: 'relative',
  },
  searchText: {
    height: 40,
    position: 'absolute',
    marginLeft: 20,
    fontStyle: 'italic',
    color: Colors.darkBrown,
    // backgroundColor: 'red',
    minWidth: 250,
  },
  clearIcon: {
    position: 'relative',
    left: 280,
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
  },
  bottomSheet: {
    backgroundColor: Colors.blue,
  },
  semiCircle: {
    zIndex: -1,
    position: 'absolute',
    top: -450,
    tintColor: Colors.darkBrown,
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
  backButton: {
    position: 'absolute',
    top: '4.5%',
    left: '-5%',
    zIndex: 2,
    elevation: 1,
  },
  banner: {
    position: 'absolute',
    top: '4.5%',
    width: '100%',
    zIndex: 1,
    elevation: 1,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    elevation: 1,
  },


});
