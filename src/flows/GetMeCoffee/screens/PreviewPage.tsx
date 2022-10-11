import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { CONST_SCREEN_HOME } from '../../../../constants';
import { Body } from '../../../../typography';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { BasketSection } from '../../../components/PreviewComponents/BasketSection';
import { PreviewSection } from '../../../components/PreviewComponents/PreviewSection';
import { ScheduleSection } from '../../../components/PreviewComponents/ScheduleSection';
import { OrderingContext } from '../../../contexts';
import { DATA_SHOPS } from '../../../data/shops.data';
import { Cafe } from '../../../models';
import { CoffeeRoutes } from '../../../utils/types/navigation.types';

interface PreviewPageProps { }

export const PreviewPage = (props: PreviewPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  // ordering_dispatch({ type: 'SET_CURRENT_SHOP', payload: DATA_SHOPS[0] as Cafe });
  const current_shop = DATA_SHOPS[0] as Cafe;

  return (
    <PageLayout
      header="Preview Order"
      subHeader="Make sure everything looks good."
      showCircle
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_HOME),
        buttonText: 'Order',
      }}>
      {/* <ScrollView style={styles.container}> */}
      <BasketSection />
      <ScheduleSection />
      <PreviewSection title="Location">
        <View style={styles.locationContainer}>
          <View style={styles.locationTextContainer}>
            <Body size="small" weight="Bold" color={Colors.greyLight2}>
              {current_shop.name}
            </Body>
            <Body size="small" weight="Bold" color={Colors.greyLight2}>
              New York, NY 10001
            </Body>
          </View>

        </View>
      </PreviewSection>

      {/* <PreviewSection title="Payment Method" /> */}
      {/* </ScrollView> */}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
});
