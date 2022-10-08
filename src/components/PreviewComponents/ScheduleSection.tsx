import React, {useContext} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Colors, Spacings} from '../../../theme';
import {Body} from '../../../typography';
import {OrderingContext} from '../../contexts';

interface ScheduleSectionProps {}

export const ScheduleSection = (props: ScheduleSectionProps) => {
  const {ordering_state, ordering_dispatch} = useContext(OrderingContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold">
          Pick up time
        </Body>
      </View>
      <View style={styles.timeContainer}>
        <Body size="large" weight="Extrabld" color={Colors.brown2}>{`${ordering_state.scheduled_time}-${
          ordering_state.scheduled_time + 2
        } mins`}</Body>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight1,
    marginVertical: Spacings.s2,
    height: 100,
  },
  header: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: Spacings.s2,
  },
  timeContainer: {
    // backgroundColor: Colors.greyLight2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
