import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
    anim.value = 0;
    anim.value = withTiming(1, {
      duration: 650,
      easing: Easing.bezier(0.15, 0.1, 0.25, 1),
    })
  }, []);


  const rFormLeftStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(anim.value, [0, 1], [-150, 0]) }],
      opacity: anim.value,
    }
  }, []);

  const rFormRightStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(anim.value, [0, 1], [150, 0]) }],
      opacity: anim.value,
    }
  }, []);


  //  const handleAlphaChange = (value: string) => {
  //    const re = /^[A-Za-z]+$/;
  //    if (value === "" || re.test(value)) {
  //      setField(value);
  //    }
  //    else {
  //      setField(value.slice(0, -1));
  //      Alert.alert("Please enter alphabet characters only");
  //    }
  //  };
  //
  //  const handleNumericChange = (value: string) => {
  //    const re = /^[0-9]+$/;
  //    if (value === "" || re.test(value)) {
  //      setField(value);
  //    }
  //    else {
  //        setField('')
  ////      Alert.alert("Please enter numeric characters only");
  //    }
  //  };

  return (
    <Animated.View style={[styles.root, index === 0 ? rFormLeftStyle : rFormRightStyle]} >
      <View style={styles.titleContainer}>
        <Body size="medium" weight="Bold">
          {title}
        </Body>
      </View>
      {
        type === 'phone' ? (
          <TextInput
            style={styles.input}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={Colors.greyLight3}
            onChangeText={(text) => setField(text)}
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
            onChangeText={(text) => setField(text)}
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
    height: 80,
    alignSelf: 'center',
  },
});

export default FormField;
