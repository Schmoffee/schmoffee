import React, {createContext, useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootRoutes} from '../utils/types/navigation.types';
import CoffeeRoot from '../flows/GetMeCoffee/Root';
import AuthRoot from '../flows/Authentication/Root';
import SideDrawerRoot from '../flows/HamburgerMenu/Root';
import TrackOrderRoot from '../flows/TrackOrder/Root';
import {GlobalContext} from '../contexts';
import {AuthState} from '../utils/types/enums';

export default function Navigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootRoutes>();

function RootNavigator() {
  const {global_state} = useContext(GlobalContext);
  return (
    <RootStack.Navigator
      initialRouteName="Coffee"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <RootStack.Group>
        {global_state.auth_state === AuthState.SIGNED_IN ? (
          <>
            <RootStack.Screen name="Coffee" component={CoffeeRoot} />
            <RootStack.Screen name="SideDrawer" component={SideDrawerRoot} />
            <RootStack.Screen name="TrackOrder" component={TrackOrderRoot} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthRoot} />
        )}
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
