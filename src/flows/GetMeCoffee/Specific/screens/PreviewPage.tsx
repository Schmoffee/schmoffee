import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo} from 'react';
import {Platform, View} from 'react-native';
import {useStripe, initStripe} from '@stripe/stripe-react-native';
import {PageLayout} from '../../../../components/Layouts/PageLayout';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import {initializePaymentSheet, openPaymentSheet} from '../../../../utils/helpers/payment';
import {BasketSection} from '../../../../components/Basket/BasketSection';
import {PreviewSection} from '../../../../components/PreviewComponents/PreviewSection';
import {ScheduleSection} from '../../../../components/PreviewComponents/ScheduleSection';
import {GlobalContext, OrderingContext} from '../../../../contexts';
import {Cafe, OrderInfo, OrderItem, PlatformType, User, UserInfo} from '../../../../models';
import {DATA_SHOPS} from '../../../../data/shops.data';
import {Body} from '../../../../../typography';
import {Colors} from '../../../../../theme';
import {CONST_SCREEN_ORDER} from '../../../../../constants';
import {sendOrder} from '../../../../utils/queries/datastore';
import {LocalUser} from '../../../../utils/types/data.types';
import PushNotification from '@aws-amplify/pushnotification';

interface PreviewPageProps {}

export const PreviewPage = (props: PreviewPageProps) => {
  const {global_state} = useContext(GlobalContext);
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);

  const navigation = useNavigation<CoffeeRoutes>();
  const {initPaymentSheet, presentPaymentSheet} = useStripe(); // Stripe hook payment methods
  const [loading, setLoading] = React.useState(true);
  const total: number = useMemo(() => {
    ordering_state.specific_basket.reduce(function (acc, item) {
      return acc + item.quantity * (item.price + getOptionsPrice(item));
    }, 0);
    return 0;
  }, [ordering_state.specific_basket]);
  const current_shop = DATA_SHOPS[0] as Cafe;
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
      ordering_dispatch({type: 'SET_PAYMENT_ID', payload: payment_id});
      setLoading(false);
      await proceedToPayment();
    }
    setLoading(false);
  }

  async function handleSendOrder() {
    if (global_state.current_user && ordering_state.current_shop_id && ordering_state.payment_id) {
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
        ordering_state.payment_id,
      );
    } else {
      console.log('User or shop or payment_id is not defined');
    }
  }

  /**
   * Proceed to payment. Open the payment sheet if no error occurs.
   */
  async function proceedToPayment() {
    const successful = await openPaymentSheet(presentPaymentSheet);
    if (successful) {
      PushNotification.requestIOSPermissions();
      await handleSendOrder();
    }
  }

  const handleCheckout = async () => {
    await checkout();
    navigation.navigate('TrackOrder', {screen: CONST_SCREEN_ORDER});
  };

  return (
    <PageLayout
      header="Preview Order"
      subHeader="Make sure everything looks good."
      showCircle
      footer={{
        type: 'basket',
        buttonDisabled: false,
        onPress: handleCheckout,
        buttonText: 'Order',
      }}>
      <BasketSection />
      <ScheduleSection />
      <PreviewSection title="Location">
        <View>
          <View>
            <Body size="small" weight="Bold" color={Colors.greyLight2}>
              {current_shop.name}
            </Body>
            <Body size="small" weight="Bold" color={Colors.greyLight2}>
              New York, NY 10001
            </Body>
          </View>
        </View>
      </PreviewSection>
    </PageLayout>
  );
};
