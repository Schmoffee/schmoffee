import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const ActionButton = (props: ActionButtonProps) => {
  const handlePress = () => {
    if (props.disabled) {
      return;
    }
    console.log('meyad')
    props.onPress();
  };

  const getButtonStyle = () => {
    switch (props.variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'tertiary':
        return styles.tertiaryButton;
      default:
        return styles.primaryButton;
    }
  };

  const getLabelStyle = () => {
    switch (props.variant) {
      case 'primary':
        return styles.primaryLabel;
      case 'secondary':
        return styles.secondaryLabel;
      case 'tertiary':
        return styles.tertiaryLabel;
      default:
        return styles.primaryLabel;
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, props.disabled ? styles.disabledColor : styles.activeColor, getButtonStyle()]}>
        <Body size="medium" weight="Bold" style={[styles.text, getLabelStyle()]}>
          {props.label}
        </Body>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.s4,
  },
  disabledColor: {
    backgroundColor: Colors.grey,
  },
  activeColor: {
    backgroundColor: Colors.darkBrown2,
  },
  text: {
    color: Colors.white,
  },
  primaryButton: {
    borderRadius: Spacings.s5,
    padding: Spacings.s4,
    paddingHorizontal: Spacings.s30,
  },
  secondaryButton: {
    borderRadius: Spacings.s12,
    padding: Spacings.s2,
    marginHorizontal: Spacings.s9,
  },
  tertiaryButton: {
    borderRadius: Spacings.s12,
    padding: Spacings.s2,
    marginHorizontal: Spacings.s9,
    borderColor: Colors.darkBrown2,
    borderWidth: 5,
    backgroundColor: 'transparent',
  },

  primaryLabel: {
    color: Colors.white,
  },
  secondaryLabel: {
    color: Colors.white,
    fontSize: 22,
  },
  tertiaryLabel: {
    color: Colors.darkBrown2,
    fontSize: 22,
  },
});
