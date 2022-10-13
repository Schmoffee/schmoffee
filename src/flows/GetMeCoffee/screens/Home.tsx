import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { CONST_SCREEN_CHANGE_PAYMENT, CONST_SCREEN_LOGIN, CONST_SCREEN_SETTINGS, CONST_SCREEN_SIGNUP, CONST_SCREEN_UPDATE_PROFILE, CONST_SCREEN_WHAT } from '../../../../constants';
import { Body, Heading } from '../../../../typography';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { Cafe, OrderInfo, OrderItem, OrderStatus, User, UserInfo } from '../../../models';
import { getBestShop, sendOrder } from '../../../utils/queries/datastore';
import { GlobalContext, OrderingContext } from '../../../contexts';
import { LocalUser } from '../../../utils/types/data.types';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { Colors, Spacings } from '../../../../theme';
import { SideDrawerContent } from '../../../components/HamburgerMenu/SideDrawerContent';




export const Home = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext);
  const navigation = useNavigation<RootRoutes>();
  const HOME_WIDTH = useWindowDimensions().width;


  const anim = useSharedValue(0)

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = anim.value;
      if (ctx.startX === 0) {
        ctx.startX = 1;
      }

    },
    onActive: (event, ctx) => {
      anim.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      if (anim.value > HOME_WIDTH / 9) {
        anim.value = withTiming(HOME_WIDTH / 2)
      }
      else if (anim.value < -(HOME_WIDTH / 6)) {
        anim.value = withTiming(HOME_WIDTH / 2)
      }
      else {
        anim.value = withTiming(0)
      }
    },
  });

  const rPageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: anim.value }, { skewY: `${anim.value / 2400}rad` }],
      opacity: interpolate(anim.value, [0, HOME_WIDTH / 2], [1, 0.7]),
    };

  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const rBackgroundStyle = useAnimatedStyle(() => {
    return {
    };
  });




  const handlePagePress = () => {
    if (anim.value === 195) {
      anim.value = withTiming(0)
    }
  }

  const handleHamburgerPress = () => {
    if (anim.value === 0) {
      anim.value = withTiming(195)
    }
    else {
      anim.value = withTiming(0)
    }
  }


  return (
    <PanGestureHandler onGestureEvent={gestureHandler} hitSlop={{
      left: 0, width: anim.value >= 194 ? 0 : HOME_WIDTH / 2
    }
    }>
      <Animated.View style={rContainerStyle}>
        <Pressable onPressOut={handlePagePress}>
          <Animated.View style={rPageStyle}>
            <PageLayout
              hamburger
              hamburgerOnPress={handleHamburgerPress}
              header="Schmoffee"

              footer={{
                buttonDisabled: false,
                onPress: () => navigation.navigate(CONST_SCREEN_WHAT),
                buttonText: 'Get me coffee',
              }}>

              <View>
                <Pressable
                  style={({ pressed }) => [
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
                      { latitude: 40, longitude: 0.11 },
                    );
                    ordering_dispatch({ type: 'SET_CURRENT_SHOP', payload: best_shop });
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
                      const user_info: UserInfo = { name: user.name as string, phone: user.phone as string };
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
                  {/* <Text>Send Order</Text> */}
                </Pressable>
              </View>
            </PageLayout>
          </Animated.View>
        </Pressable>

        <SideDrawerContent anim={anim} />

      </Animated.View >

    </PanGestureHandler >
  );

};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
