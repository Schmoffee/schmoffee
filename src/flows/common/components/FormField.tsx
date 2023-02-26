import React, { useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Colors, Spacings } from '../theme';
import { Body } from '../typography';
import Animated, { Easing, FadeInLeft, FadeOutLeft, useSharedValue, withTiming } from 'react-native-reanimated';

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
  index = 0,
}) => {
  let secureTextEntry = false;
  let autoCorrect = true;
  let maxLength = 1235;
  switch (type) {
    case 'name':
      autoCorrect = false;
      break;
    case 'phone':
      autoCorrect = false;
      break;
  }

  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withTiming(1, {
      duration: 650,
      easing: Easing.bezier(0.15, 0.1, 0.25, 1),
    });
  }, [anim]);

  return (
    <Animated.View
      entering={FadeInLeft.duration(400).easing(Easing.ease)}
      exiting={FadeOutLeft.easing(Easing.ease)}
      style={[styles.root]}>
      <View style={styles.titleContainer}>
        <Body size="medium" weight="Bold">
          {title}
        </Body>
      </View>
      {type === 'phone' ? (
        <View style={styles.phoneInputContainer}>
          <Body size="medium" weight="Regular" style={styles.countryCode}>
            (+44)
          </Body>
          <TextInput
            style={styles.phoneInput}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={Colors.greyLight3}
            onChangeText={text => setField(text)}
            value={value}
            autoCorrect={autoCorrect}
            maxLength={maxLength}
            keyboardType={'phone-pad'}
          />
        </View>
      ) : (
        <TextInput
          style={styles.textInput}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={Colors.greyLight3}
          onChangeText={text => setField(text)}
          value={value}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          keyboardType={'default'}
        />
      )
      }
    </Animated.View >
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: Spacings.s4,
    alignItems: 'flex-start',
    paddingHorizontal: Spacings.s7,
  },
  textInput: {
    height: Spacings.s13,
    width: '80%',
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: Colors.black,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  phoneInput: {
    height: Spacings.s13,
    width: '80%',
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: Colors.black,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    height: 50,
    marginTop: 10,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  countryCode: {
    color: Colors.black,
    marginRight: Spacings.s1,
  },
  titleContainer: {
    marginBottom: Spacings.s1,
    marginLeft: Spacings.s1,
  },

});

export default FormField;
