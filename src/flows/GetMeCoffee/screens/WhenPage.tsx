import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CONST_SCREEN_PREVIEW, CONST_SCREEN_WHEN} from '../../../../constants';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';

interface WhenPageProps {}

export const WhenPage = (props: WhenPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();

  return (
    <PageLayout
      header="When do you need it?"
      subHeader="Schedule your pick-up."
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_PREVIEW),
        buttonText: 'Continue',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});
