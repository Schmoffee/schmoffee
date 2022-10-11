import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, StyleSheet, Pressable, TouchableOpacity, Text} from 'react-native';
import {CONST_SCREEN_LOGIN, CONST_SCREEN_SIGNUP, CONST_SCREEN_WHAT} from '../../../../constants';
import {Body} from '../../../../typography';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {RootRoutes} from '../../../utils/types/navigation.types';
import {Cafe, OrderInfo, OrderItem, OrderStatus, User, UserInfo} from '../../../models';
import {getBestShop, sendOrder} from '../../../utils/queries/datastore';
import {GlobalContext, OrderingContext} from '../../../contexts';
import {LocalUser} from '../../../utils/types/data.types';

export const Home = () => {
  const {global_state, global_dispatch} = useContext(GlobalContext);
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
  const navigation = useNavigation<RootRoutes>();

  const handleLogOut = async () => {
    navigation.navigate(CONST_SCREEN_LOGIN);
    // await signOut();
  };

  return (
    <PageLayout
      header="Schmoffee"
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_WHAT),
        buttonText: 'Get me coffee',
      }}>
      <TouchableOpacity onPress={handleLogOut}>
        <View style={styles.button}>
          <Body size="medium" weight="Extrabld">
            Log Out
          </Body>
        </View>
      </TouchableOpacity>
      <View>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
          ]}
          onPress={async () => {
            // TODO: If a current order is already running, deny.
            console.log('started');
            const best_shop: Cafe | null = await getBestShop(
              global_state.current_user as LocalUser,
              ordering_state.specific_basket,
              ordering_state.scheduled_time,
              {latitude: 40, longitude: 0.11},
            );
            ordering_dispatch({type: 'SET_CURRENT_SHOP', payload: best_shop});
            if (global_state.current_user && best_shop) {
              const user: User = global_state.current_user;
              let ordered_items: OrderItem[] = [];
              let total = 0;
              for (const common_item of ordering_state.common_items) {
                const order_item: OrderItem = {
                  name: common_item.name,
                  price: common_item.price,
                  options: null,
                  quantity: 1,
                  preparation_time: common_item.preparation_time,
                };
                ordered_items.push(order_item);
                total += common_item.price;
              }
              const order_info: OrderInfo = {
                sent_time: new Date(Date.now()).toISOString(),
                status: OrderStatus.SENT,
                scheduled_times: [new Date(Date.now() + 30 * 60000).toISOString()],
              };
              const user_info: UserInfo = {name: user.name as string, phone: user.phone as string};
              console.log('sending order');
              const order_id: string = await sendOrder(
                ordered_items,
                total,
                order_info,
                best_shop.id,
                global_state.current_user.id,
                user_info,
              );
              console.log(order_id);
            }
          }}>
          <Text>Send Order</Text>
        </Pressable>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    // backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
