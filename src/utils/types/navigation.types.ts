import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootRoutes {}
  }
}

export type AuthRoutes = {
  Signup: undefined;
  Login: undefined;
};

export type CoffeeRoutes = {
  navigate(screen: string): void;
  Home: undefined;
  WhatPage: undefined;
  WhenPage: undefined;
  PreviewPage: undefined;
};

export type RootRoutes = {
  navigate(screen: string): void;
  Auth: NavigatorScreenParams<AuthRoutes> | undefined;
  Coffee: NavigatorScreenParams<CoffeeRoutes> | undefined;
};

export type CoffeeScreenProps = NativeStackNavigationProp<CoffeeRoutes>;
export type AuthScreenProps = NativeStackNavigationProp<AuthRoutes>;
export type RootScreenProps = NativeStackNavigationProp<RootRoutes>;
