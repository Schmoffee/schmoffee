import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TrackOrderContext } from '../../../contexts';
import { TrackOrderRoutes } from '../../../utils/types/navigation.types';
import { OrderStatus } from '../../../models';
import { Body, Heading } from '../../common/typography';
import { PageLayout } from '../../common/components/PageLayout';
import { Colors, Spacings } from '../../common/theme';
import CustomModal from '../../common/components/CustomModal';
import Map from '../../common/components/Map/Map';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { HEIGHT, WIDTH } from '../../../../constants';

export const OrderPage = () => {
  const navigation = useNavigation<TrackOrderRoutes>();
  const { track_order_state } = useContext(TrackOrderContext);

  const color = track_order_state.current_order ? track_order_state.current_order?.order_info.color : Colors.red;
  const pin = track_order_state.current_order ? track_order_state.current_order?.order_info.pin : '0000';


  const anim = useSharedValue(0);
  const [showPin, setShowPin] = useState(false);

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

  const handlePress = () => {
    showPin ? setShowPin(false) : setShowPin(true);
    anim.value = withTiming(showPin ? 0 : 1, { duration: 300 });
  };

  const rStyleShowPin = useAnimatedStyle(() => {
    return {
      transform: [
        // {
        //   translateX: interpolate(anim.value, [0, 1], [0, WIDTH]),
        // },
        {
          translateY: interpolate(anim.value, [0, 1], [45, 0], Extrapolate.CLAMP),
        },
        {
          scale: interpolate(anim.value, [0, 1], [0.3, 1], Extrapolate.CLAMP),
        },
      ],
      opacity: interpolate(anim.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    };
  });

  return (
    <PageLayout
      header="Your Order"
      backgroundColor={Colors.greyLight1}
      footer={{
        buttonDisabled: false,
        onPress: () => handlePress(),
        buttonText: showPin ? 'Hide Pin' : 'Show Pin',
      }}>
      <Animated.View style={[styles.showPin, rStyleShowPin, { backgroundColor: color }]}>
        <Heading size="large" weight="Bold" color={Colors.black} style={styles.pinText}>
          {pin}
        </Heading>
      </Animated.View>
      <View style={styles.mapContainer}>
        <Map
          cafeIdFilter={track_order_state.current_order?.cafeID}
          cafeLocationFilter={track_order_state.destination}
        />
      </View>
      <View style={styles.orderDetailsContainer}>
        <View style={styles.timeContainer}>
          <Image
            style={{ height: 70, width: 75 }}
            source={{ uri: 'https://schmoffee-storage111934-dev.s3.eu-central-1.amazonaws.com/public/pickup-icon.png' }}
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
            style={{ height: 70, width: 75 }}
            source={{ uri: 'https://schmoffee-storage111934-dev.s3.eu-central-1.amazonaws.com/public/location-icon.png' }}
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
  mapContainer: {
    flex: 1,
    height: '50%',
    width: '95%',
    borderRadius: 40,
    marginTop: Spacings.s5,
    borderWidth: 1,
    borderColor: Colors.greyLight3,
    overflow: 'hidden',
  },
  orderDetailsContainer: {
    height: '30%',
    width: '95%',
    paddingTop: Spacings.s5,
    paddingHorizontal: Spacings.s2,
    marginBottom: Spacings.s25,
  },
  iconsContainer: {
    paddingVertical: Spacings.s6,
    height: '100%',
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacings.s7,
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  timeText: {
    marginLeft: Spacings.s5,
    flex: 1,
    alignItems: 'flex-start',
  },
  location: {
    height: '50%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  showPin: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT + 100,
    borderRadius: 30,
    zIndex: 1,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 100,
    letterSpacing: Spacings.s3,
    paddingLeft: Spacings.s3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
    marginBottom: Spacings.s25,
  },

});
