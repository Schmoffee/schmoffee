import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthRoutes } from '../../utils/types/navigation.types';
import { Intro } from './screens/Intro';
import { Login } from './screens/LogIn';
import { Signup } from './screens/Signup';

const Root = () => {
  const AuthStack = createNativeStackNavigator<AuthRoutes>();

  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Intro" component={Intro} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
};

export default Root;
