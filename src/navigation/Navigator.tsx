import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootRoutes } from '../utils/types/navigation.types';
import CoffeeRoot from '../flows/GetMeCoffee/Root';
import AuthRoot from '../flows/Authentication/Root';
import SideDrawerRoot from '../flows/HamburgerMenu/Root';
import TrackOrderRoot from '../flows/TrackOrder/Root';

export default function Navigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootRoutes>();

function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <RootStack.Group>
        <RootStack.Screen name="Auth" component={AuthRoot} />
        <RootStack.Screen name="Coffee" component={CoffeeRoot} />
        <RootStack.Screen name="SideDrawer" component={SideDrawerRoot} />
        <RootStack.Screen name="TrackOrder" component={TrackOrderRoot} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
