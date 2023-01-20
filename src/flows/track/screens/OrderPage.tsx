import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {CONST_SCREEN_RATING_PAGE} from '../../../../constants';
import {TrackOrderContext} from '../../../contexts';
import {TrackOrderRoutes} from '../../../utils/types/navigation.types';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {OrderStatus} from '../../../models';
import {Body} from '../../common/typography';
import {PageLayout} from '../../common/components/PageLayout';
import {Spacings} from '../../common/theme';
import CustomModal from '../../common/components/CustomModal';

export const OrderPage = () => {
  const navigation = useNavigation<TrackOrderRoutes>();
  const {track_order_state} = useContext(TrackOrderContext);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);

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

  return (
    <PageLayout
      header="Your Order"
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_RATING_PAGE),
        buttonText: 'Finish Order',
      }}>
      <View style={styles.bottomSheetContainer}>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={handleSheetChange} index={1}>
          <Body size="large" weight="Bold" color={Colors.darkBrown2} style={styles.bottomSheetHeader}>
            Order details
          </Body>
          <View style={styles.orderDetailsContainer}>
            <Body size="large" weight="Bold" style={styles.text}>
              Order ID: {track_order_state.current_order?.id}
            </Body>
            <Body size="large" weight="Bold" style={styles.text}>
              Order Status: {track_order_state.current_order?.status}
            </Body>
            <Body size="large" weight="Bold" style={styles.text}>
              Order Total: {track_order_state.current_order?.total}
            </Body>
          </View>
          <View style={styles.orderItemsContainer}>
            <Body size="large" weight="Bold" style={styles.text}>
              Order Items
            </Body>
            <View style={styles.orderItems}>
              {track_order_state.current_order?.items?.map((item: any, index: number) => {
                return (
                  <View key={index} style={styles.orderItem}>
                    <Body size="large" weight="Regular" style={styles.text}>
                      {item.name}
                    </Body>
                    <Body size="large" weight="Regular" style={styles.text}>
                      {item.options}
                    </Body>
                    <Body size="large" weight="Regular" style={styles.text}>
                      {item.quantity}
                    </Body>
                    <Body size="large" weight="Regular" style={styles.text}>
                      {item.price}
                    </Body>
                  </View>
                );
              })}
            </View>
          </View>
        </BottomSheet>
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
