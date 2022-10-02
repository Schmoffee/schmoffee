import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PageLayout} from '../../components/Layouts/PageLayout';

interface ShopProfileProps {}

export const ShopProfile = (props: ShopProfileProps) => {
  return <PageLayout header="Shop info" />;
};

const styles = StyleSheet.create({
  container: {},
});
