import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Colors, Spacings} from '../../theme';
import {Body} from '../../typography';
import PhoneInput from 'react-native-phone-number-input';

// @ts-ignore

/**
 * Custom form field reused throughout the app.
 * @param title
 * @param placeholder
 * @param setField
 * @param value
 * @param type
 * @param testID
 */
const FormField = ({
  // @ts-ignore
  title = 'Title',
  placeholder = '',
  // @ts-ignore
  setField,
  value = '',
  type = '',
}) => {
  let secureTextEntry = false;
  let autoCorrect = true;
  let maxLength = 1235;
  switch (type) {
    case 'name':
      autoCorrect = false;
      break;
    case 'email':
      autoCorrect = false;
      break;
    case 'password':
      secureTextEntry = true;
      autoCorrect = false;
      break;
  }

  return (
    <View style={[styles.root]}>
      <View style={styles.titleContainer}>
        <Body size="medium" weight="Bold">
          {title}
        </Body>
      </View>
      {type === 'phone' ? (
        <PhoneInput
          defaultCode="GB"
          layout="first"
          onChangeText={text => {
            setField(text);
          }}
          onChangeFormattedText={text => {
            setField(text);
          }}
          // withShadow
          autoFocus
          containerStyle={styles.phoneInputContainer}
          textInputStyle={styles.phoneInputText}
          placeholder={'Enter Phone Number'}
          value={value}
        />
      ) : (
        <TextInput
          style={styles.input}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={Colors.greyLight3}
          onChangeText={text => setField(text)}
          value={value}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          // textContentType={'oneTimeCode'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: Spacings.s4,
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.greyLight1,
    height: Spacings.s13,
    borderRadius: 13,
    paddingHorizontal: Spacings.s3,
    width: '80%',
  },
  titleContainer: {
    marginBottom: Spacings.s1,
    marginLeft: Spacings.s1,
  },
  phoneInputContainer: {
    backgroundColor: Colors.greyLight1,
    borderRadius: 13,
    paddingHorizontal: Spacings.s3,
    width: '80%',
    height: 60,
    alignSelf: 'center',
  },
  phoneInputText: {
    fontFamily: 'ProximaNova-Regular',
  },
});

export default FormField;
