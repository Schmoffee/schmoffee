import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PageLayout} from '../../components/Layouts/PageLayout';

interface ShopPageProps {}

export const ShopPage = (props: ShopPageProps) => {
  return <PageLayout header="Shop Page" subHeader="We`ve done the hard work." />;
};

const styles = StyleSheet.create({
  container: {},
});
