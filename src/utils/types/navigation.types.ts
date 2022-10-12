import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootRoutes { }
  }
}

export type SideDrawerRoutes = {
  ChangePayment: undefined;
  UpdateProfile: undefined;
  Settings: undefined;
};

export type AuthRoutes = {
  Intro: undefined;
  Signup: undefined;
  Login: undefined;
};

export type CoffeeRoutes = {
  navigate(screen: any, navigator?: any): void;
  Home: undefined;
  WhatPage: undefined;
  WhenPage: undefined;
  PreviewPage: undefined;
  ItemPage: undefined;
};

export type RootRoutes = {
  openDrawer(): void;
  navigate(screen: any, navigator?: any): void;
  Auth: NavigatorScreenParams<AuthRoutes> | undefined;
  Coffee: NavigatorScreenParams<CoffeeRoutes> | undefined;
  SideDrawer: NavigatorScreenParams<SideDrawerRoutes> | undefined;
};

export type CoffeeScreenProps = NativeStackNavigationProp<CoffeeRoutes>;
export type AuthScreenProps = NativeStackNavigationProp<AuthRoutes>;
export type RootScreenProps = NativeStackNavigationProp<RootRoutes>;
