import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo} from 'react';
import {useStripe, initStripe, confirmPaymentSheetPayment} from '@stripe/stripe-react-native';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {CoffeeRoutes} from '../../../utils/types/navigation.types';
import {initializePaymentSheet, openPaymentSheet} from '../../../utils/helpers/payment';
import {GlobalContext, OrderingContext} from '../../../contexts';
import {OrderItem, User} from '../../../models';
import {Alert} from 'react-native';

interface PreviewPageProps { }

export const PreviewPage = (props: PreviewPageProps) => {
  const {global_state} = useContext(GlobalContext);
  const {ordering_state} = useContext(OrderingContext);
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
    let ready;
    if (user && user.customer_id) {
      ready = await initializePaymentSheet(
        initPaymentSheet,
        {
          amount: total,
          currency: 'gbp',
          customer_id: user.customer_id,
        },
        user.id,
      );
    } else {
      ready = await initializePaymentSheet(
        initPaymentSheet,
        {
          amount: total,
          name: 'lol',
          phone: '44',
          currency: 'gbp',
        },
        user.id,
      );
    }
    if (ready) {
      setLoading(false);
      await proceedToPayment();
    }
    setLoading(false);
  }

  /**
   * Proceed to payment. Open the payment sheet if no error occurs.
   */
  async function proceedToPayment() {
    const successful = await openPaymentSheet(presentPaymentSheet);
    if (successful) {
      // TODO: Send order here and wait for acceptance
    }
  }

  // TODO: Call this method when the order is accepted
  async function confirmPayment() {
    const {error} = await confirmPaymentSheetPayment();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  }

  return (
    <PageLayout
      header="Preview Order"
      subHeader="Make sure everything looks good."
      showCircle
      footer={{
        buttonDisabled: false,
        onPress: () => checkout(),
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
