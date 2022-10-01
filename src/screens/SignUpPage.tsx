import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import FormField from '../components/FormField';
import { signIn, signUp } from '../utils/queries/auth';
import { GlobalContext } from '../contexts';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { ErrorTypes } from '../utils/enums';
import { useNavigation } from '@react-navigation/native';
import { CONST_SCREEN_HOME } from '../../constants';

export const SignUpPage = () => {
  const { global_state, global_dispatch } = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    setLoading(true);
    const tempUser = await signUp(name, number);
    console.log(tempUser);

    const newSession = await signIn(number);
    if (newSession instanceof CognitoUser) {
      setSession(newSession);
    }
    console.log(newSession);

    setLoading(false);
  };

  const handleNavigate = () => {
    navigation.navigate(CONST_SCREEN_HOME);
  };

  return (
    <View style={styles.wrapper} testID={'sign_up_page'}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <Text>Sign Up</Text>
      <View style={styles.formContainer}>
        <View style={styles.namesContainer}>
          <FormField
            style={[styles.subNameContainer, styles.subNameContainerLeft]}
            title={'Name'}
            placeholder={'Jane'}
            setField={setName}
            type={'name'}
            value={name}
          />
        </View>
        <FormField
          title={'Phone Number'}
          placeholder={''}
          setField={setNumber}
          type={'password'}
          value={number}
          style={undefined}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text>LOOOL</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigate}>
          <Text>LOOOL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#EDEBE7',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
  },
  formContainer: {
    flex: 1,
    paddingTop: '5%',
  },

  namesContainer: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: '2%',
  },
  subNameContainer: {
    flex: 1,
  },
  subNameContainerLeft: {
    marginRight: '5%',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '4%',
  },
  hyperlink: {
    marginVertical: '2%',
    textDecorationLine: 'underline',
    textAlignVertical: 'bottom',
  },
});
