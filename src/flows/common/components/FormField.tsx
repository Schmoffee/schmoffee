import React, {useEffect} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {Colors, Spacings} from '../theme';
import {Body} from '../typography';
import Animated, {Easing, FadeInLeft, FadeOutLeft, useSharedValue, withTiming} from 'react-native-reanimated';

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
        <TextInput
          style={styles.input}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={Colors.greyLight3}
          onChangeText={text => setField(text)}
          value={value}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          keyboardType={'default'}
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
          keyboardType={'default'}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: Spacings.s4,
    alignItems: 'flex-start',
    paddingHorizontal: Spacings.s7,
  },
  input: {
    height: Spacings.s13,
    width: '80%',
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: 'Helvetica',
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
    height: 80,
    alignSelf: 'center',
  },
});

export default FormField;