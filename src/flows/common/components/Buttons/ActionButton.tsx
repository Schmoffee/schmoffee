import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors, Spacings } from '../../theme';
import { Body } from '../../typography';

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
    marginTop: Spacings.s2,
  },
  disabledColor: {
    backgroundColor: Colors.grey,
  },
  activeColor: {
    backgroundColor: Colors.darkBlue,
  },
  text: {
    color: Colors.white,
  },
  primaryButton: {
    borderRadius: Spacings.s3,
    padding: Spacings.s4,
    // marginVertical: Spacings.s2,
    width: '100%',
    height: 50,
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
