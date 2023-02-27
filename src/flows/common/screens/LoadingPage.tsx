import {ActivityIndicator, View, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../theme';

const LoadingPage = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brown2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoadingPage;
