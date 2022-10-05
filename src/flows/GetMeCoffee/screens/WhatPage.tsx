import { useNavigation } from '@react-navigation/native';
import React, { useContext, useReducer } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CONST_SCREEN_WHEN } from '../../../../constants';
import { Colors, Spacings } from '../../../../theme';
import { CardSection } from '../../../components/CardSection';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { DATA_ITEMS } from '../../../data/items.data';
import { CoffeeRoutes } from '../../../utils/types/navigation.types';


interface WhatPageProps { }

export const WhatPage = (props: WhatPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const coffees = DATA_ITEMS.filter((item) => item.family === 'Coffee');
  const pastries = DATA_ITEMS.filter((item) => item.family === 'Pastry');
  const juices = DATA_ITEMS.filter((item) => item.family === 'Juice');

  return (
    <PageLayout
      header="What do you crave?"
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_WHEN),
        buttonText: 'Continue',
      }}
    >
      {/* <View style={styles.container}> */}
      <ScrollView style={styles.container}>
        <CardSection title="Coffee" items={coffees} />
        <CardSection title="Juices" items={juices} />
        <CardSection title="Pastries" items={pastries} />
      </ScrollView>
    </PageLayout >
  );
};

const styles = StyleSheet.create({
  container: {

  },
});
