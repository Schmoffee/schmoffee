import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';

// @ts-ignore

/**
 * Custom form field reused throughout the app.
 * @param style
 * @param title
 * @param placeholder
 * @param setField
 * @param value
 * @param type
 * @param testID
 */
const FormField = ({
  // @ts-ignore
  style,
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
    <View style={style}>
      <Text style={[styles.text]}>{title}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={'#D3D3D3'}
        onChangeText={text => setField(text)}
        value={value}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        textContentType={'oneTimeCode'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: '2.5%',
  },

  input: {
    backgroundColor: '#F9F9F9',
    height: 37,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: '3.5%',
    color: 'black',
  },
});

export default FormField;
