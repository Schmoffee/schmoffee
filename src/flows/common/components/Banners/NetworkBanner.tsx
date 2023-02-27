import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {Body} from '../../typography';

const NetworkBanner = () => {
  return (
    <View style={styles.container}>
      <Body style={styles.text}>You are currently offline. Please connect to the internet to continue.</Body>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red,
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

export default NetworkBanner;
