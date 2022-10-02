import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CONST_SCREEN_WHEN} from '../../../../constants';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';

interface WhatPageProps {}

export const WhatPage = (props: WhatPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  return (
    <PageLayout
      header="What do you crave?"
      subHeader="Your greatest desires."
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_WHEN),
        buttonText: 'Continue',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});
