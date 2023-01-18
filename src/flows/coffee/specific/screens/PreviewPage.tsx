import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useStripe,
  initStripe,
  useGooglePay,
  GooglePayButton,
  useApplePay,
  ApplePayButton,
} from '@stripe/stripe-react-native';
import { CoffeeRoutes } from '../../../../utils/types/navigation.types';
import {
  createGooglePaymentMethod,
  initializeGooglePay,
  initializePaymentSheet,
  openPaymentSheet,
  payWithApplePay,
} from '../../../../utils/helpers/payment';
import { BasketSection } from '../../components/basket/BasketSection';
import { GlobalContext, OrderingContext } from '../../../../contexts';
import { Cafe, OrderInfo, OrderItem, PlatformType, User, UserInfo } from '../../../../models';
import { CONST_SCREEN_ORDER } from '../../../../../constants';
import { getShopById, sendOrder, updatePaymentMethod } from '../../../../utils/queries/datastore';
import { LocalUser, Payment, PaymentParams, ShopMarker } from '../../../../utils/types/data.types';
import Map from '../../../track/components/Map';
import { Region } from 'react-native-maps';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { clearStorageSpecificBasket } from '../../../../utils/helpers/storage';
import ScheduleSection from '../../components/preview/ScheduleSection';
import { PageLayout } from '../../../common/components/PageLayout';
import PreviewSection from '../../components/preview/PreviewSection';
import { Colors, Spacings } from '../../../common/theme';
import { useDeepCompareEffect } from 'react-use';
import { Body, Heading } from '../../../common/typography';
import LeftChevronBackButton from '../../../common/components/LeftChevronBackButton';
import { ActionButton } from '../../../common/components/ActionButton';

interface PreviewPageProps { }
export const PreviewPage = (props: PreviewPageProps) => {
  const { global_state } = useContext(GlobalContext);
  const { ordering_state } = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Stripe hook payment methods
  const { isGooglePaySupported } = useGooglePay();
  const { isApplePaySupported } = useApplePay();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<Payment>('card');
  const [mapLoading, setMapLoading] = useState(true);
  const [region, setRegion] = useState<Region>();
  const [markers, setMarkers] = useState<ShopMarker[]>([]);
  const [total, setTotal] = useState(0);

  useDeepCompareEffect(() => {
    let totalTemp = ordering_state.specific_basket
      .reduce(function (acc, item) {
        return acc + item.quantity * (item.price + getOptionsPrice(item));
      }, 0)
      .toFixed(2);
    setTotal(+totalTemp * 100);
  }, [ordering_state.specific_basket]);

  useEffect(() => {
    async function fetchData() {
      const new_shop: Cafe = (await getShopById(ordering_state.current_shop_id as string)) as Cafe;
      setMarkers([
        {
          name: new_shop.name,
          coords: { latitude: new_shop.latitude, longitude: new_shop.longitude },
          description: new_shop.description,
          is_open: new_shop.is_open,
          image: new_shop.image ? new_shop.image : '',
        },
      ]);
      setRegion({
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        latitude: new_shop.latitude,
        longitude: new_shop.longitude,
      });
      setMapLoading(false);
    }

    fetchData().then(() => console.log('done'));
  }, [ordering_state.current_shop_id]);

  /**
   * Calculate and return the total price of the options of an item
   * @param item The target item
   * @return Number The total price for the item's options
   */
  function getOptionsPrice(item: OrderItem) {
    return item.options
      ? item.options.reduce(function (acc, option) {
        return acc + option.price;
      }, 0)
      : 0;
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
      }
    }
    setLoading(false);
  }

  async function googlePayCheckout(user_id: string, paymentParams: PaymentParams) {
    if (!(await isGooglePaySupported({ testEnv: true }))) {
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
    console.log('Apple Pay is supported.');
    return await payWithApplePay(user_id, paymentParams);
  }

  async function handleSendOrder(paymentId: string) {
    if (global_state.current_user && ordering_state.current_shop_id && paymentId) {
      const user: LocalUser = global_state.current_user as LocalUser;
      const order_info: OrderInfo = {
        sent_time: new Date(Date.now()).toISOString(),
        scheduled_times: [new Date(Date.now() + 30 * 60000).toISOString()],
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
      await clearStorageSpecificBasket();
    } else {
      console.log('User or shop or payment_id is not defined');
    }
  }

  const handleCheckout = async () => {
    await checkout(payment);
    navigation.navigate('TrackOrder', { screen: CONST_SCREEN_ORDER });
  };

  return (
    <View style={styles.root}>
      <View style={styles.backButton}>
        <LeftChevronBackButton />
      </View>
      <ScrollView style={styles.previewScrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ minHeight: '100%' }}>

          <View style={styles.heading}>
            <Heading size='default' weight='Bold' color={Colors.white} >
              Summary
            </Heading>
          </View>
          <View style={styles.basketContainer}>
            <BasketSection />
          </View>
          <ScheduleSection />
          <PreviewSection title="Pick up location" description='23-25 Leather Ln, London EC1N 7TE'>
            <View style={styles.mapContainer}>
              {mapLoading ? (
                <ActivityIndicator size="large" color={Colors.blue} />
              ) : (
                <Map markers={markers} region={region} />
              )}
            </View>
          </PreviewSection>

          <View style={styles.paymentRoot}>
            <PreviewSection title="Payment method">
              <View style={styles.paymentContainer}>
                <TouchableOpacity

                  onPress={() => setPayment('card')}
                  style={styles.paymentButton}
                >
                  <Text style={styles.paymentText}>Card</Text>
                </TouchableOpacity>
                <TouchableOpacity

                  onPress={() => setPayment('google')}
                  style={styles.paymentButton}
                >
                  <Text style={styles.paymentText}>Google Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity

                  onPress={() => setPayment('apple')}
                  style={styles.paymentButton}
                >
                  <Text style={styles.paymentText}>Apple Pay</Text>
                </TouchableOpacity>
              </View>
            </PreviewSection>
          </View>
          <View style={styles.totalContainer}>
            <Body size='large' weight='Bold' color={Colors.white} >
              Total
            </Body>
            <Body size='large' weight='Bold' color={Colors.white} >
              £{total}
            </Body>

          </View>

        </View>

        {
          payment === 'google' && (
            <GooglePayButton
              type="standard"
              onPress={handleCheckout}
              style={{
                width: '100%',
                height: 50,
              }}
            />
          )
        }
        {
          payment === 'apple' && (
            <ApplePayButton
              onPress={handleCheckout}
              type="plain"
              buttonStyle="black"
              borderRadius={4}
              style={{
                width: '100%',
                height: 50,
              }}
            />
          )
        }
        <ActionButton label="Checkout" onPress={handleCheckout} />

      </ScrollView>

    </View >

  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBrown,
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
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentRoot: {
    // marginTop: 20,
    height: 150,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -160,
  },
  paymentButton: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
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
