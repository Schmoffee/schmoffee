import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootRoutes {}
  }
}

export type SideDrawerRoutes = {
  ChangePayment: undefined;
  UpdateProfile: undefined;
  Settings: undefined;
};

export type AuthRoutes = {
  navigate(arg0: string, arg1: {screen: string}): unknown;
  Intro: undefined;
  AuthPage: undefined;
  Login: undefined;
  VerifyMobile: undefined;
};

export type CoffeeRoutes = {
  navigate(screen: any, navigator?: any): void;
  push(screen: any, navigator?: any): void;
  Home: undefined;
  WhatPage: undefined;
  WhenPage: undefined;
  PreviewPage: undefined;
  ItemPage: undefined;
  ShopPage: undefined;
  ChangeShopPage: undefined;
  Cafes: undefined;
};

export type TrackOrderRoutes = {
  navigate(screen: any, navigator?: any): void;
  push(screen: any, navigator?: any): void;
  OrderPage: undefined;
  RatingPage: undefined;
};

export type RootRoutes = {
  openDrawer(): void;
  navigate(screen: any, navigator?: any): void;
  push(screen: any, navigator?: any): void;
  Auth: NavigatorScreenParams<AuthRoutes> | undefined;
  Coffee: NavigatorScreenParams<CoffeeRoutes> | undefined;
  SideDrawer: NavigatorScreenParams<SideDrawerRoutes> | undefined;
  TrackOrder: NavigatorScreenParams<TrackOrderRoutes> | undefined;
};

export type CoffeeScreenProps = NativeStackNavigationProp<CoffeeRoutes>;
export type AuthScreenProps = NativeStackNavigationProp<AuthRoutes>;
export type RootScreenProps = NativeStackNavigationProp<RootRoutes>;
