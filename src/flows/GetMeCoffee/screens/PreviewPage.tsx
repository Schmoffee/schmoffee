import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {CONST_SCREEN_HOME} from '../../../../constants';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {BasketSection} from '../../../components/PreviewComponents/BasketSection';
import {PreviewSection} from '../../../components/PreviewComponents/PreviewSection';
import {ScheduleSection} from '../../../components/PreviewComponents/ScheduleSection';
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
      }}>
      <ScrollView style={styles.container}>
        <BasketSection />
        <ScheduleSection />
        <PreviewSection title="Location" />
        <PreviewSection title="Payment Method" />
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
});
