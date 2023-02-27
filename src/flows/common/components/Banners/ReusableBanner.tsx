import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {Body} from '../../typography';

interface ReusableBannerProps {
  text: string;
  color: string;
}

const ReusableBanner = (props: ReusableBannerProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.color,
        },
      ]}>
      <Body style={styles.text}>{props.text}</Body>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  text: {
    color: Colors.white,
  },
});

export default ReusableBanner;
