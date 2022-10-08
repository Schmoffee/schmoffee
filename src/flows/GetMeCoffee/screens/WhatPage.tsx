import {useNavigation} from '@react-navigation/native';
import React, {useContext, useReducer, useState} from 'react';
import {View, StyleSheet, ScrollView, TextInput} from 'react-native';
import {CONST_SCREEN_WHEN} from '../../../../constants';
import {Colors, Spacings} from '../../../../theme';
import {CardSection} from '../../../components/WhatComponents/CardSection';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {OrderingContext} from '../../../contexts';
import {DATA_ITEMS} from '../../../data/items.data';
import {Item} from '../../../models';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {BasketSection} from '../../../components/PreviewComponents/BasketSection';

interface WhatPageProps {}

export const WhatPage = (props: WhatPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const [items, setItems] = useState(DATA_ITEMS);
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);

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

  const contains = ({name}: Item, query: string) => {
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

      {ordering_state.common_basket.length > 0 && <BasketSection />}

      <ScrollView style={styles.container}>
        <CardSection title="Coffee" items={getCoffees()} />
        <CardSection title="Juices" items={getJuices()} />
        <CardSection title="Pastries" items={getPastries()} hideDivider />
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
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
