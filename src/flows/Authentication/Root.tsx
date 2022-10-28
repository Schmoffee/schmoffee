import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthRoutes } from '../../utils/types/navigation.types';
import { Login } from './screens/LogIn';
import { Signup } from './screens/Signup';
import { VerifyMobile } from './screens/VerifyMobile';

const Root = () => {
  const AuthStack = createNativeStackNavigator<AuthRoutes>();

  return (
    <AuthStack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerShown: false,
      }}>
      {/* <AuthStack.Screen name="Intro" component={Intro} /> */}
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="VerifyMobile" component={VerifyMobile} />

    </AuthStack.Navigator>
  );
};

export default Root;
