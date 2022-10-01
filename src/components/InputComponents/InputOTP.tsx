import React, {useRef, useState, useEffect, MutableRefObject, useCallback} from 'react';
import {TextInput, View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import {Colors} from '../../../theme';
import {Body} from '../../../typography';

interface InputOTPProps {
  code: string;
  setCode: (value: string) => void;
  maxLength: number;
  setIsPinComplete: (value: boolean) => void;
}

export const InputOTP = (props: InputOTPProps) => {
  const boxArray = new Array(props.maxLength).fill(0);
  const inputRef = useRef() as MutableRefObject<TextInput>;

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = useCallback(() => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  }, []);

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    // update pin ready status
    props.setIsPinComplete(props.code.length === props.maxLength);
    // clean up function
    return () => {
      props.setIsPinComplete(false);
    };
  }, [props.code]);

  const handleOnChangeText = (text: string) => {
    props.setCode(text.replace(/[^0-9]/g, ''));
  };

  const boxDigit = (_: number, index: number) => {
    const emptyInput = '';
    const digit = props.code[index] || emptyInput;

    const isCurrentValue = index === props.code.length;
    const isLastValue = index === props.maxLength - 1;
    const isCodeComplete = props.code.length === props.maxLength;
    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    useEffect(() => {
      isLastValue && isCodeComplete ? setIsInputBoxFocused(false) : isCurrentValue ? setIsInputBoxFocused(true) : null;
    }, [props.code]);
    const StyledSplitBoxes =
      isInputBoxFocused && isValueFocused ? [styles.splitBoxesFocused, styles.splitBoxes] : styles.splitBoxes;

    return (
      <View style={StyledSplitBoxes} key={index}>
        <Body size="medium" weight="Bold" style={styles.splitBoxText}>
          {digit}
        </Body>
      </View>
    );
  };

  return (
    <View style={styles.inputContainer}>
      <Pressable style={styles.splitOTPContainer} onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </Pressable>
      <TextInput
        style={styles.textInputHidden}
        value={props.code}
        onChangeText={handleOnChangeText}
        maxLength={props.maxLength}
        ref={inputRef}
        onBlur={handleOnBlur}
        keyboardType="numeric"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputHidden: {
    position: 'absolute',
    opacity: 0,
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginTop: 50,
  },
  splitOTPContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    zIndex: 1,
  },
  splitBoxes: {
    width: 50,
    height: 50,
    borderColor: Colors.greenFaded3,
    borderWidth: 1,
    borderRadius: 5,
  },
  splitBoxesFocused: {
    borderColor: Colors.greyLight2,
    backgroundColor: Colors.greyLight2,
  },
  splitBoxText: {
    textAlign: 'center',
    color: 'black',
    marginVertical: '30%',
    height: '100%',
  },
});
