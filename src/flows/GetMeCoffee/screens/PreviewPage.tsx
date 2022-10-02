import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CONST_SCREEN_HOME} from '../../../../constants';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';

interface PreviewPageProps {}

export const PreviewPage = (props: PreviewPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();

  return (
    <PageLayout
      header="Preview Order"
      subHeader="Make sure everything looks good."
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_HOME),
        buttonText: 'Order',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});
