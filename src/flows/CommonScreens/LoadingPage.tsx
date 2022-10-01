import {ActivityIndicator, View, StyleSheet} from 'react-native';
import React from 'react';

const LoadingPage = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#046D66" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EDEBE7',
  },
});

export default LoadingPage;
