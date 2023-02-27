import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CONST_SCREEN_CHANGE_PAYMENT, CONST_SCREEN_PAST_ORDERS, CONST_SCREEN_SETTINGS, CONST_SCREEN_UPDATE_PROFILE } from '../../../../constants';
import { deleteUser, signOut } from '../../../utils/queries/auth';
import { AuthState, GlobalActionName } from '../../../utils/types/enums';
import { RootRoutes } from '../../../utils/types/navigation.types';
import { deleteAccount, updateDeviceToken } from '../../../utils/queries/datastore';
import { GlobalContext } from '../../../contexts';
import { Body, Heading } from '../../common/typography';
import { Colors, Spacings } from '../../common/theme';
import { Alerts } from '../../../utils/helpers/alerts';
import FastImage from 'react-native-fast-image';

interface SideDrawerContentProps {
  anim: Animated.SharedValue<number>;
}

export const SideDrawerContent = ({ anim }: SideDrawerContentProps) => {
  const navigation = useNavigation<RootRoutes>();
  const HOME_WIDTH = useWindowDimensions().width;
  const { global_state, global_dispatch } = useContext(GlobalContext);

  const handleSignOut = async () => {
    const id = global_state.current_user?.id as string;
    const { logout, success } = await Alerts.logoutAlert(signOut);
    if (logout && !success) {
      global_dispatch({
        type: GlobalActionName.SET_AUTH_STATE,
        payload: AuthState.SIGNING_OUT_FAILED,
      });
    } else if (logout && success) {
      await updateDeviceToken(id, '');
    }
  };

  const rSideDrawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: anim.value - HOME_WIDTH }],
      opacity: (anim.value / HOME_WIDTH) * 10,
    };
  });

  const handleCloseDrawer = () => {
    anim.value = withTiming(0, { duration: 300 });
  };

  const handleDeleteAccount = async () => {
    const del = await Alerts.deleteAccountAlert();
    if (del) {
      await deleteAccount(global_state.current_user?.id as string);
      await signOut();
      await deleteUser();
    }
  };

  return (
    <Animated.View style={[styles.sideDrawer, rSideDrawerStyle]}>
      <View>
        <View style={styles.closeDrawerButton}>
          <Pressable onPress={handleCloseDrawer}>
            <FastImage source={require('../../../assets/pngs/x-outline.png')} style={styles.closeDrawerIcon} />
          </Pressable>
        </View>

        <View style={styles.sideDrawerContent}>
          <Heading size="small" weight="Extrabld">
            {/* Hi, {global_state.current_user?.name}! */}
            SCHMOFFEE
          </Heading>


          <Pressable onPress={() => navigation.navigate('SideDrawer', { screen: CONST_SCREEN_UPDATE_PROFILE })}>
            <View style={styles.sideDrawerButton}>
              <Body size="medium" weight="Bold">
                Update profile
              </Body>
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('SideDrawer', { screen: CONST_SCREEN_PAST_ORDERS })}>
            <View style={styles.sideDrawerButton}>
              <Body size="medium" weight="Bold">
                Past Orders
              </Body>
            </View>
          </Pressable>

          <View style={styles.logOutDelete}>
            <Pressable onPress={handleSignOut}>
              <View style={styles.logOut}>
                <Body size="medium" weight="Extrabld">
                  Log Out
                </Body>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={() => handleDeleteAccount()}>
            <View style={styles.deleteAccount}>
              <Body size="medium" weight="Extrabld" color={Colors.red}>
                Delete Account
              </Body>
            </View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sideDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
    width: '50%',
    alignItems: 'center',
    backgroundColor: Colors.greyLight1,
  },
  closeDrawerButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    padding: Spacings.s2,
  },
  closeDrawerIcon: {
    width: 14,
    height: 14,
  },
  sideDrawerContent: {
    padding: Spacings.s5,
    height: '100%',
    marginVertical: Spacings.s8,
  },
  sideDrawerButton: {
    borderColor: Colors.gold,
    borderWidth: 3,
    padding: Spacings.s2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.s12,
  },
  logOutDelete: {
    justifyContent: 'flex-end',
    height: '65%',
  },

  logOut: {
    padding: 10,
    marginTop: Spacings.s8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAccount: {
    padding: 10,
    marginTop: Spacings.s2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
