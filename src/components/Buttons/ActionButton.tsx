import React from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Colors, Spacings} from '../../../theme';
import {Body} from '../../../typography';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const ActionButton = (props: ActionButtonProps) => {
  const handlePress = () => {
    if (props.disabled) {
      return;
    }
    props.onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, props.disabled ? styles.disabledColor : styles.activeColor]}>
        <Body size="medium" weight="Bold" style={styles.text}>
          {props.label}
        </Body>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacings.s3,
    padding: Spacings.s4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.s4,
    // borderColor: Colors.greyLight2,
    // borderWidth: 2,
  },
  disabledColor: {
    backgroundColor: Colors.goldLight3,
  },
  activeColor: {
    backgroundColor: Colors.goldLight1,
  },
  text: {
    color: Colors.white,
  },
});
