import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootRoutes} from '../utils/types/navigation.types';
import CoffeeRoot from '../flows/GetMeCoffee/Root';
import AuthRoot from '../flows/Authentication/Root';

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
      initialRouteName="Coffee"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <RootStack.Group>
        <RootStack.Screen name="Auth" component={AuthRoot} />
        <RootStack.Screen name="Coffee" component={CoffeeRoot} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
