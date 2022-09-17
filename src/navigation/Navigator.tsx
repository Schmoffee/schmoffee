import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import {SignUpPage} from '../screens/SignUpPage';

export default function Navigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
