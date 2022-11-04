import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Spacings } from '../../../theme';
import { Body } from '../../../typography';

interface PreviewSectionProps {
  title: string;
  children?: React.ReactNode;
}

export const PreviewSection = (props: PreviewSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold" color={Colors.white}>
          {props.title}
        </Body>
      </View>
      <View style={styles.content}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBrown,
    marginVertical: Spacings.s2,
    height: 250,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  header: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: Spacings.s2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
