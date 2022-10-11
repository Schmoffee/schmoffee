import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { CONST_SCREEN_WHEN } from '../../../../constants';
import { Colors, Spacings } from '../../../../theme';
import { CardSection } from '../../../components/WhatComponents/CardSection';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { OrderingContext } from '../../../contexts';
import { DATA_ITEMS } from '../../../data/items.data';
import { Item } from '../../../models';
import { CoffeeRoutes } from '../../../utils/types/navigation.types';
import { BasketSection } from '../../../components/PreviewComponents/BasketSection';
import Animated, { Easing, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface WhatPageProps { }

export const WhatPage = (props: WhatPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const [items, setItems] = useState(DATA_ITEMS);
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });


  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, []);

  const [query, setQuery] = useState('');

  const getCoffees = () => {
    return items.filter(item => item.family === 'Coffee');
  };
  const getJuices = () => {
    return items.filter(item => item.family === 'Juice');
  };
  const getPastries = () => {
    return items.filter(item => item.family === 'Pastry');
  };

  const contains = ({ name }: Item, query: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes(query)) {
      return true;
    }
    return false;
  };

  const handleSearch = (text: string) => {
    const formattedQuery = text.toLowerCase();
    const filteredData = DATA_ITEMS.filter(item => {
      return contains(item, formattedQuery);
    });
    setItems(filteredData);
    setQuery(text);
  };

  const pageStyle = useAnimatedStyle(
    () => ({
      // opacity: anim.value * 0.5,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-150, 0])
        }
      ]
    }),
    []
  );


  return (

    <PageLayout
      header="What do you crave?"
      footer={{
        buttonDisabled: ordering_state.common_basket.length === 0,
        onPress: () => navigation.navigate(CONST_SCREEN_WHEN),
        buttonText: 'Continue',
        type: 'basket',
      }}>

      <View style={styles.searchInputContainer}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
        />
      </View>




      <Animated.ScrollView style={[styles.container, pageStyle]}
        onScroll={scrollHandler}
        pagingEnabled
        scrollEventThrottle={16}>
        <BasketSection translateY={translateY} />
        <CardSection title="Coffee" items={getCoffees()} />
        <CardSection title="Juices" items={getJuices()} />
        <CardSection title="Pastries" items={getPastries()} hideDivider />
      </Animated.ScrollView>
    </PageLayout >
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacings.s4 },
  basketContainer: {},
  searchInputContainer: {
    backgroundColor: Colors.greyLight1,
    borderRadius: Spacings.s5,
    padding: Spacings.s2,
    // marginTop: -Spacings.s2,
    marginHorizontal: Spacings.s4,
    marginBottom: -Spacings.s1,
    // height: 60,
    overflow: 'hidden',
  },
});
