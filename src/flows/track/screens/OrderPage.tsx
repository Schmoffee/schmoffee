import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TrackOrderContext} from '../../../contexts';
import {TrackOrderRoutes} from '../../../utils/types/navigation.types';
import {OrderStatus} from '../../../models';
import {Body} from '../../common/typography';
import {PageLayout} from '../../common/components/PageLayout';
import {Colors, Spacings} from '../../common/theme';
import CustomModal from '../../common/components/CustomModal';
import Map from '../../common/components/Map';

export const OrderPage = () => {
  const navigation = useNavigation<TrackOrderRoutes>();
  const {track_order_state} = useContext(TrackOrderContext);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    if (track_order_state.current_order?.status === OrderStatus.ACCEPTED) {
      setShowSuccessModal(true);
    }
  }, [track_order_state.current_order?.status]);

  useEffect(() => {
    if (track_order_state.current_order?.status === OrderStatus.REJECTED) {
      setShowRejectionModal(true);
    }
  }, [track_order_state.current_order?.status]);

  const handleFinishOrder = () => {
    console.log('Order finished');
  };

  return (
    <PageLayout
      header="Your Order"
      backgroundColor={Colors.greyLight1}
      footer={{
        buttonDisabled: false,
        onPress: () => handleFinishOrder(),
        buttonText: 'Show Pin',
      }}>
      <View style={styles.mapContainer}>
        <Map cafeIdFilter={track_order_state.current_order?.cafeID} />
      </View>
      <View style={styles.orderDetailsContainer}>
        <View style={styles.timeContainer}>
          <Image
            style={{height: 70, width: 75}}
            source={{uri: 'https://schmoffee-storage111934-dev.s3.eu-central-1.amazonaws.com/public/pickup-icon.png'}}
          />
          <View style={styles.timeText}>
            <Body size="small" weight="Extrabld" color={Colors.greyLight3}>
              Pickup time
            </Body>
            <Body size="large" weight="Bold" color={Colors.black}>
              {track_order_state.current_order?.order_info.scheduled_times[0]}
            </Body>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Image
            style={{height: 70, width: 75}}
            source={{uri: 'https://schmoffee-storage111934-dev.s3.eu-central-1.amazonaws.com/public/location-icon.png'}}
          />
          <View style={styles.timeText}>
            <Body size="small" weight="Extrabld" color={Colors.greyLight3}>
              Pickup address
            </Body>
            <Body size="large" weight="Bold" color={Colors.black}>
              {track_order_state.address}
            </Body>
          </View>
        </View>
      </View>
      <CustomModal
        visible={showSuccessModal}
        setVisible={setShowSuccessModal}
        type="success"
        title="Order Accepted"
        message="Your order has been accepted pussy"
      />
      <CustomModal
        visible={showRejectionModal}
        setVisible={setShowRejectionModal}
        type="error"
        title="Order Rejected"
        message="Your order has been rejected pussy"
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderDetailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    marginBottom: 10,
  },
  orderItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSheetContainer: {
    height: '100%',
    elevation: 200,
    zIndex: 100,
    position: 'absolute',
    width: '100%',
    bottom: 35,
  },
  bottomSheetHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s7,
  },

  bottomSheetHeader: {
    marginTop: Spacings.s5,
    alignSelf: 'center',
    fontSize: 25,
  },
  bottomSheetHandleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheetHandle: {
    width: 20,
    height: 20,
    borderRadius: 2.5,
    backgroundColor: Colors.brown2,
    marginTop: Spacings.s5,
    marginRight: Spacings.s5,
  },
});
