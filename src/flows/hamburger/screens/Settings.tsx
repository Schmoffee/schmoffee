import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PageLayout} from '../../common/components/PageLayout';

const Settings = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <PageLayout header={'Settings'} />
    </Pressable>
  );
};

export default Settings;
