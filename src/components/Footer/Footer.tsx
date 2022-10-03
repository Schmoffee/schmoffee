import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spacings} from '../../../theme';
import {FooterType} from '../../utils/types/component.types';
import {ActionButton} from '../Buttons/ActionButton';

export const Footer = (props: FooterType) => {
  return (
    <View style={styles.root}>
      {props.hide ? null : (
        <View>
          {props.children ? <View style={styles.childrenContainer}>{props.children}</View> : null}
          <ActionButton
            label={props.buttonText ? props.buttonText : 'Continue'}
            disabled={props.buttonDisabled}
            onPress={() => props.onPress()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: Spacings.s4,
    justifyContent: 'flex-end',
  },

  childrenContainer: {
    alignSelf: 'center',
    paddingBottom: Spacings.s2,
  },
});
