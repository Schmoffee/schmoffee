import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useStripe, initStripe, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { PageLayout } from '../../../../components/Layouts/PageLayout';
import { CoffeeRoutes } from '../../../../utils/types/navigation.types';
import { initializePaymentSheet, openPaymentSheet } from '../../../../utils/helpers/payment';
import { BasketSection } from '../../../../components/Basket/BasketSection';
import { PreviewSection } from '../../../../components/PreviewComponents/PreviewSection';
import { ScheduleSection } from '../../../../components/PreviewComponents/ScheduleSection';
import { GlobalContext, OrderingContext } from '../../../../contexts';
import { Cafe, OrderInfo, OrderItem, PlatformType, User, UserInfo } from '../../../../models';
import { Body } from '../../../../../typography';
import { Colors } from '../../../../../theme';
import { CONST_SCREEN_ORDER } from '../../../../../constants';
import { getShopById, sendOrder } from '../../../../utils/queries/datastore';
import { LocalUser, Location, ShopMarker } from '../../../../utils/types/data.types';
import PushNotification from '@aws-amplify/pushnotification';
import Map from '../../../TrackOrder/components/Map';
import { Region } from 'react-native-maps';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface PreviewPageProps {
  anim: Animated.SharedValue<number>;
}

export const PreviewPage = (props: PreviewPageProps) => {
  const { global_state } = useContext(GlobalContext);
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const HOME_HEIGHT = useWindowDimensions().height;
  const navigation = useNavigation<CoffeeRoutes>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Stripe hook payment methods
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [region, setRegion] = useState<Region>();


  const total: number = useMemo(() => {
    let totalTemp = ordering_state.specific_basket.reduce(function (acc, item) {
      return acc + item.quantity * (item.price + getOptionsPrice(item));
    }, 0).toFixed(2);
    return totalTemp * 100
  }, [ordering_state.specific_basket]);
  console.log(total)

  const [markers, setMarkers] = useState<ShopMarker[]>([]);

  useEffect(() => {
    async function fetchData() {
      const new_shop: Cafe = await getShopById(ordering_state.current_shop_id as string) as Cafe;
      setMarkers([{ name: new_shop.name, coords: { latitude: new_shop.latitude, longitude: new_shop.longitude }, description: new_shop.description, is_open: new_shop.is_open, image: new_shop.image }]);
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

  // 21007329
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
    }).then(r => 'Stripe initialized');
  }, []);

  /**
   * Checkout. If the server is ready and the basket is not empty, proceed to payment.
   */
  async function checkout() {
    const user: User = global_state.current_user as User;
    setLoading(true);
    let payment_id;
    if (user && user.customer_id) {
      payment_id = await initializePaymentSheet(
        initPaymentSheet,
        {
          amount: total,
          currency: 'gbp',
          customer_id: user.customer_id,
        },
        user.id,
      );
    } else {
      payment_id = await initializePaymentSheet(
        initPaymentSheet,
        {
          amount: total,
          name: global_state.current_user?.name,
          phone: global_state.current_user?.phone,
          currency: 'gbp',
        },
        user.id,
      );
    }
    if (payment_id) {
      setLoading(false);
      console.log('setting: ', payment_id)
      await proceedToPayment(payment_id);
    }
    setLoading(false);
  }

  async function handleSendOrder(paymentId: string) {
    console.log("1 :", paymentId);
    console.log("2 :", ordering_state.current_shop_id);
    console.log("3 :", global_state.current_user);
    if (global_state.current_user && ordering_state.current_shop_id && paymentId) {
      console.log('loooool')
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
    } else {
      console.log('User or shop or payment_id is not defined');
    }
  }

  /**
   * Proceed to payment. Open the payment sheet if no error occurs.
   */
  async function proceedToPayment(paymentId: string) {
    const successful = await openPaymentSheet(presentPaymentSheet);
    if (successful) {
      // PushNotification.requestIOSPermissions();
      await handleSendOrder(paymentId);
    }
  }

  const handleCheckout = async () => {
    await checkout();
    navigation.navigate('TrackOrder', { screen: CONST_SCREEN_ORDER });
  };


  const rPreviewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: ordering_state.specific_basket.length > 0 ? props.anim.value + (HOME_HEIGHT + 420) : props.anim.value + (HOME_HEIGHT + 500),
        },

      ],
      // opacity: (props.anim.value / HOME_HEIGHT) * 10,
    };
  });

  return (
    <Animated.View style={[styles.root, rPreviewStyle]}>
      <PageLayout
        // header="Finish your order"
        // headerColor='white'
        // subHeader="Make sure everything looks good."
        footer={{
          type: 'basket',
          buttonDisabled: false,
          onPress: handleCheckout,
          buttonText: 'Order',
        }}
        backgroundColor={'#1c1414'}

      >
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.previewScrollContainer} >
            <BasketSection />
            <ScheduleSection />
            <PreviewSection title="Location">
              <View style={styles.mapContainer}>
                {mapLoading ? <ActivityIndicator size="large" color={Colors.blue} /> : <Map markers={markers} region={region} />}
              </View>
            </PreviewSection>
          </ScrollView>
        </View>
      </PageLayout>
    </Animated.View >

  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 2,
    zIndex: 1,
  },
  previewScrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',

  },


});
