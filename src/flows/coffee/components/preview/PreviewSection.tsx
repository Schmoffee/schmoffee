import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacings } from '../../../common/theme';
import { Body } from '../../../common/typography';

interface PreviewSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PreviewSection = (props: PreviewSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold" color={Colors.white}>
          {props.title}
        </Body>
        <Body size="medium" weight="Bold" color={Colors.greyLight3}>
          {props.description}
        </Body>
      </View>
      <View style={styles.content}>{props.children}</View>
    </View>
  );
};

export default PreviewSection;

const styles = StyleSheet.create({
  container: {
    marginTop: Spacings.s7,
    paddingTop: Spacings.s2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    marginHorizontal: 20,
    flex: 1,

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
