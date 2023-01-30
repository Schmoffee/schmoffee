import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {
  useStripe,
  initStripe,
  useGooglePay,
  GooglePayButton,
  useApplePay,
  ApplePayButton,
} from '@stripe/stripe-react-native';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import {
  createGooglePaymentMethod,
  initializeGooglePay,
  initializePaymentSheet,
  openPaymentSheet,
  payWithApplePay,
} from '../../../../utils/helpers/payment';
import {BasketSection} from '../../components/basket/BasketSection';
import {GlobalContext, OrderingContext} from '../../../../contexts';
import {OrderInfo, PlatformType, User, UserInfo, UsualOrder} from '../../../../models';
import {CONST_SCREEN_ORDER} from '../../../../../constants';
import {sendOrder, setUsualOrder, updatePaymentMethod} from '../../../../utils/queries/datastore';
import {LocalUser, Payment, PaymentParams} from '../../../../utils/types/data.types';
import Map from '../../../common/components/Map/Map';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {clearStorageSpecificBasket} from '../../../../utils/helpers/storage';
import ScheduleSection from '../../components/preview/ScheduleSection';
import PreviewSection from '../../components/preview/PreviewSection';
import {Colors, Spacings} from '../../../common/theme';
import {useDeepCompareEffect} from 'react-use';
import {Body, Heading} from '../../../common/typography';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';
import {ActionButton} from '../../../common/components/Buttons/ActionButton';
import {BlurView} from '@react-native-community/blur';
import {getOptionsPrice} from '../../../../utils/helpers/basket';
import {getOrderId} from '../../../../utils/helpers/order_id';

interface PreviewPageProps {}
export const PreviewPage = (props: PreviewPageProps) => {
  const {global_state} = useContext(GlobalContext);
  const {ordering_state} = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();
  const {initPaymentSheet, presentPaymentSheet} = useStripe(); // Stripe hook payment methods
  const {isGooglePaySupported} = useGooglePay();
  const {isApplePaySupported} = useApplePay();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [usual, setUsual] = useState(true);
  const [scheduled_time, setScheduledTime] = useState(5);

  useDeepCompareEffect(() => {
    let totalTemp = ordering_state.specific_basket
      .reduce(function (acc, item) {
        return acc + item.quantity * (item.price + getOptionsPrice(item));
      }, 0)
      .toFixed(2);
    setTotal(+totalTemp);
  }, [ordering_state.specific_basket]);

  function getCafeLocation() {
    const cafe = ordering_state.cafes.find(c => c.id === ordering_state.current_shop_id);
    return cafe ? {latitude: cafe.latitude, longitude: cafe.longitude} : undefined;
  }

  function getCafeAddress() {
    const cafe = ordering_state.cafes.find(c => c.id === ordering_state.current_shop_id);
    return cafe ? cafe.address : undefined;
  }

  useEffect(() => {
    initStripe({
      publishableKey:
        'pk_test_51LpXnPHooJo3N51b7Z3VtEqrSdqqibloS52hthuoujRyJMo7cRUnVVXY8HUApFgsmk9MctXNbcLFLftl9qv9QpVL00ynhr4KLf',
      merchantIdentifier: 'merchant.co.uk.schmoffee',
    })
      .then(() => 'Stripe initialized')
      .catch(e => console.log(e));
  }, []);

  /**
   * Checkout. If the server is ready and the basket is not empty, proceed to payment.
   */
  async function checkout(mode: Payment) {
    const user: User = global_state.current_user as LocalUser;
    let paymentParams: PaymentParams;
    setLoading(true);
    await updatePaymentMethod(user.id, mode);
    let payment_id;
    if (user) {
      if (user.customer_id) {
        paymentParams = {
          amount: total,
          currency: 'gbp',
          customer_id: user.customer_id,
        };
      } else {
        paymentParams = {
          amount: total,
          name: global_state.current_user?.name,
          phone: global_state.current_user?.phone,
          currency: 'gbp',
        };
      }
      console.log('Payment params: ', paymentParams);
      if (mode === 'google') {
        payment_id = await googlePayCheckout(user.id, paymentParams);
      } else if (mode === 'card') {
        payment_id = await cardCheckout(user.id, paymentParams);
        const successful = await openPaymentSheet(presentPaymentSheet);
        if (!successful) payment_id = null;
      } else if (mode === 'apple') {
        payment_id = await applePayCheckout(user.id, paymentParams);
      }

      if (payment_id) {
        setLoading(false);
        if (Platform.OS === 'ios') await PushNotificationIOS.requestPermissions();
        await handleSendOrder(payment_id);
        return true;
      }
      return false;
    }
    setLoading(false);
    return false;
  }

  async function googlePayCheckout(user_id: string, paymentParams: PaymentParams) {
    if (!(await isGooglePaySupported({testEnv: true}))) {
      Alert.alert('Google Pay is not supported.');
      return;
    }
    await initializeGooglePay();
    return await createGooglePaymentMethod(user_id, paymentParams);
  }

  async function cardCheckout(user_id: string, paymentParams: PaymentParams) {
    return await initializePaymentSheet(initPaymentSheet, paymentParams, user_id);
  }

  async function applePayCheckout(user_id: string, paymentParams: PaymentParams) {
    if (!isApplePaySupported) {
      Alert.alert('Apple Pay is not supported.');
      return;
    }
    return await payWithApplePay(user_id, paymentParams);
  }

  async function handleSendOrder(paymentId: string) {
    if (global_state.current_user && ordering_state.current_shop_id && paymentId) {
      const user: LocalUser = global_state.current_user as LocalUser;
      const {orderId, pin, final_color} = getOrderId();
      const order_info: OrderInfo = {
        sent_time: new Date(Date.now()).toISOString(),
        scheduled_times: [new Date(Date.now() + scheduled_time * 60000).toISOString()],
        color: final_color,
        pin: pin,
        unique_id: orderId,
      };
      const platform = Platform.OS === 'ios' ? PlatformType.IOS : PlatformType.ANDROID;
      const user_info: UserInfo = {
        name: user.name,
        phone: user.phone,
        device_token: user.device_token,
        platform: platform,
      };
      await sendOrder(
        ordering_state.specific_basket,
        total,
        order_info,
        ordering_state.current_shop_id,
        global_state.current_user.id,
        user_info,
        paymentId,
      );
      if (usual) {
        await saveUsualOrder();
      }
      await clearStorageSpecificBasket();
    } else {
      console.log('User or shop or payment_id is not defined');
    }
  }

  async function saveUsualOrder() {
    if (global_state.current_user && ordering_state.current_shop_id) {
      const usual_order: UsualOrder = {
        items: ordering_state.specific_basket,
        schedule: scheduled_time,
        cafeID: ordering_state.current_shop_id,
      };
      await setUsualOrder(usual_order, global_state.current_user.id);
    }
  }

  const handleCheckout = async (mode: Payment) => {
    if (mode === 'card') {
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to checkout, this action is final. It will send your order.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => await initiateCheckout(mode),
          },
        ],
      );
    } else {
      await initiateCheckout(mode);
    }
  };

  const initiateCheckout = async (mode: Payment) => {
    setLoading(true);
    const success = await checkout(mode);
    setLoading(false);
    if (success) {
      navigation.navigate('TrackOrder', {screen: CONST_SCREEN_ORDER});
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.backButton}>
        <LeftChevronBackButton color={'#fff'} />
      </View>
      <ScrollView style={styles.previewScrollContainer} contentContainerStyle={{flexGrow: 1}}>
        <View style={{minHeight: '100%'}}>
          <View style={styles.heading}>
            <Heading size="default" weight="Bold" color={Colors.white}>
              Summary
            </Heading>
          </View>
          <View style={styles.basketContainer}>
            <BasketSection />
          </View>
          <ScheduleSection setSchedule={setScheduledTime} />
          <PreviewSection title="Pick up location" description={getCafeAddress()}>
            <View style={styles.mapContainer}>
              <Map cafeIdFilter={ordering_state.current_shop_id} cafeLocationFilter={getCafeLocation()} />
            </View>
          </PreviewSection>

          <PreviewSection title="Payment method">
            <View style={styles.paymentContainer}>
              {Platform.OS === 'ios' && (
                <ApplePayButton
                  onPress={() => handleCheckout('apple')}
                  type="plain"
                  buttonStyle="black"
                  borderRadius={4}
                  style={{
                    width: '100%',
                    height: 50,
                  }}
                />
              )}
              {Platform.OS !== 'ios' && (
                <GooglePayButton
                  type="standard"
                  onPress={() => handleCheckout('google')}
                  style={{
                    width: 200,
                    height: 50,
                  }}
                />
              )}
              <ActionButton label="Checkout" onPress={() => handleCheckout('card')} />
            </View>
          </PreviewSection>

          <View style={styles.totalContainer}>
            <Body size="large" weight="Bold" color={Colors.white}>
              Total
            </Body>
            <Body size="large" weight="Bold" color={Colors.white}>
              £{(total / 100).toFixed(2)}
            </Body>
          </View>
        </View>
      </ScrollView>
      {loading && (
        <>
          <BlurView style={styles.absolute} blurType="dark" blurAmount={10} />
          <ActivityIndicator
            animating={loading}
            size="large"
            color={Colors.gold}
            style={{position: 'absolute', top: '45%', left: '45%', zIndex: 5}}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBrown,
  },

  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: -10,
    zIndex: 1,
    marginBottom: 100,
  },

  previewScrollContainer: {
    // flex: 1,
    // backgroundColor: 'red',
  },

  heading: {
    flexDirection: 'row',
    marginTop: 50,
    paddingBottom: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    borderBottomColor: Colors.greyLight2,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  basketContainer: {
    borderBottomColor: Colors.greyLight3,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacings.s5,
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentRoot: {
    // marginTop: 20,
    height: 150,
    backgroundColor: Colors.red,
  },
  paymentContainer: {
    marginTop: Spacings.s5,
    height: 100,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: Spacings.s7,
  },
  totalText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
