import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {GlobalContext} from '../../../contexts';
import {TrackOrderRoutes} from '../../../utils/types/navigation.types';
import {CurrentOrder, OrderStatus} from '../../../models';
import {Body, Heading} from '../../common/typography';
import {PageLayout} from '../../common/components/PageLayout';
import {Colors, Spacings} from '../../common/theme';
import CustomModal from '../../common/components/CustomModal';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {CONST_SCREEN_HOME, CONST_SCREEN_SHOP, HEIGHT, WIDTH} from '../../../../constants';
import OrderCardCarousel from '../components/OrderCardCarousel';
import {getNiceTime} from '../../../utils/helpers/others';
import {terminateOrder} from '../../../utils/queries/datastore';
import {checkPermissions} from '../../../utils/helpers/notifications';

export const OrderPage = () => {
  const navigation = useNavigation<TrackOrderRoutes>();
  const {global_state} = useContext(GlobalContext);
  const color = global_state.current_order ? global_state.current_order?.order_info.color : Colors.red;
  const pin = global_state.current_order ? global_state.current_order?.order_info.pin : '0000';
  const [notifEnabled, setNotifEnabled] = useState<boolean>(true);

  const anim = useSharedValue(0);
  const [showPin, setShowPin] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    checkPermissions().then(res => {
      setNotifEnabled(res);
    });
  }, []);

  useEffect(() => {
    if (global_state.current_order?.status === OrderStatus.ACCEPTED) {
      setShowSuccessModal(true);
    }
  }, [global_state.current_order?.status]);

  useEffect(() => {
    if (global_state.current_order?.status === OrderStatus.REJECTED) {
      setShowRejectionModal(true);
    }
  }, [global_state.current_order?.status]);

  const handlePress = async () => {
    showPin ? setShowPin(false) : setShowPin(true);
    anim.value = withTiming(showPin ? 0 : 1, {duration: 300});
  };

  function getButtonText() {
    if (global_state.current_order) {
      return showPin ? 'Hide Pin' : 'Show Pin';
    }
  }

  const handleRejection = async () => {
    const order: CurrentOrder = global_state.current_order as CurrentOrder;
    await terminateOrder(order.id, [], true);
    navigation.navigate('Coffee', {screen: CONST_SCREEN_SHOP});
  };

  const rStyleShowPin = useAnimatedStyle(() => {
    return {
      transform: [
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

  function getTime() {
    if (global_state.current_order) {
      return getNiceTime(global_state.current_order?.order_info.scheduled_times[0]);
    }
  }

  return (
    <PageLayout
      header="Order Details"
      backButton
      backgroundColor={Colors.greenFaded1}
      backPress={() => navigation.navigate('Coffee', {screen: CONST_SCREEN_HOME})}
      footer={{
        buttonDisabled: false,
        onPress: async () => await handlePress(),
        buttonText: getButtonText(),
      }}>
      <Animated.View style={[styles.showPin, rStyleShowPin, {backgroundColor: color}]}>
        <Heading size="large" weight="Bold" color={Colors.black} style={styles.pinText}>
          {pin}
        </Heading>
      </Animated.View>

      <View style={styles.carouselContainer}>
        <OrderCardCarousel />
      </View>
      <View style={styles.orderDetailsContainer}>
        <View style={styles.timeContainer}>
          <Image
            style={{height: 70, width: 75}}
            source={{uri: 'https://schmoffee-storage111934-dev.s3.eu-central-1.amazonaws.com/public/pickup-icon.png'}}
          />

          <View style={styles.timeText}>
            <Body size="small" weight="Extrabld" color={Colors.greyLight3}>
              Pickup time and status
            </Body>
            <View style={{display: 'flex', flexDirection: 'row', maxWidth: '80%'}}>
              <View>
                <Body size="large" weight="Bold" color={Colors.black}>
                  {getTime()}
                </Body>
                <Body size="large" weight="Bold" color={Colors.blue} style={{marginTop: '2%'}}>
                  {global_state.current_order?.status}
                </Body>
              </View>
              {notifEnabled ? null : (
                <Body size="extraSmall" weight="Bold" color={Colors.red} style={{marginLeft: '5%'}}>
                  Your notifications are disabled. Enable them to receive updates on your order.
                </Body>
              )}
            </View>
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
              Chapters Cafe, Strand Campus
            </Body>
          </View>
        </View>
      </View>
      <CustomModal
        visible={showSuccessModal}
        setVisible={setShowSuccessModal}
        type="success"
        title="Order Accepted"
        message="Your order has been accepted!"
      />
      <CustomModal
        visible={showRejectionModal}
        setVisible={setShowRejectionModal}
        onDismiss={handleRejection}
        type="error"
        title="Order Rejected"
        message={'Your order has been rejected. We are sorry for the inconvenience.'}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: '40%',
    width: '80%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.greyLight3,
    overflow: 'hidden',
  },
  carouselContainer: {
    marginTop: Spacings.s15,
    height: '60%',
    width: '100%',
  },
  orderDetailsContainer: {
    height: '30%',
    width: '95%',
    paddingTop: Spacings.s8,
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
