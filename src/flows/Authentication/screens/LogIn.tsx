import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FormField from '../../../components/FormField';
import {Spacings} from '../../../../theme';
import {ActionButton} from '../../../components/Buttons/ActionButton';
import {PageLayout} from '../../../components/Layouts/PageLayout';
import {useNavigation} from '@react-navigation/native';
import {CONST_SCREEN_HOME} from '../../../../constants';

interface LoginProps {}

const Login = (props: LoginProps) => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');

  const isValidNumber = useCallback(() => {
    return number.length === 13;
  }, [number]);

  return (
    <PageLayout header="Log in" subHeader="Enter your phone number to log in">
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FormField title={'Phone Number'} placeholder={''} setField={setNumber} type={'phone'} value={number} />
        </View>
        <View style={styles.buttonContainer}>
          <ActionButton
            label="Sign In"
            onPress={() => navigation.navigate(CONST_SCREEN_HOME)}
            disabled={!isValidNumber()}
          />
        </View>
      </View>
    </PageLayout>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: Spacings.s16,
  },
  formContainer: {
    marginTop: Spacings.s1,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
});
