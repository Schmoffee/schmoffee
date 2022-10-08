import React from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Colors, Spacings} from '../../../theme';
import {Body} from '../../../typography';

interface PreviewSectionProps {
  title: string;
  children?: React.ReactNode;
}

export const PreviewSection = (props: PreviewSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold">
          {props.title}
        </Body>
      </View>
      <View style={styles.content}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight1,
    marginVertical: Spacings.s2,
    height: 250,
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
