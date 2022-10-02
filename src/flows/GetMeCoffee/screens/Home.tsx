import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import {CONST_SCREEN_SIGNUP, CONST_SCREEN_WHAT} from '../../../../constants';
import {Body} from '../../../../typography';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {signOut} from '../../../utils/queries/auth';
import {CoffeeRoutes, RootRoutes} from '../../../utils/types/navigation.types';

interface HomeProps {}

export const Home = (props: HomeProps) => {
  const navigation = useNavigation<RootRoutes>();

  const handleLogOut = async () => {
    navigation.navigate(CONST_SCREEN_SIGNUP);
    // await signOut();
  };

  return (
    <PageLayout
      header="Schmoffee"
      footer={{
        buttonDisabled: false,
        onPress: () => navigation.navigate(CONST_SCREEN_WHAT),
        buttonText: 'Get me coffee',
      }}>
      <TouchableOpacity onPress={handleLogOut}>
        <View style={styles.button}>
          <Body size="medium" weight="Extrabld">
            Log Out
          </Body>
        </View>
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    // backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
