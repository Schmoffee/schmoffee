import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Colors, Spacings} from '../../../common/theme';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import {CONST_SCREEN_WHEN} from '../../../../../constants';
import {OrderingContext} from '../../../../contexts';
import {Body} from '../../../common/typography';

interface ScheduleSectionProps {}

const ScheduleSection = (props: ScheduleSectionProps) => {
  const {ordering_state} = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();
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
      <TouchableOpacity onPress={() => navigation.navigate(CONST_SCREEN_WHEN)}>
        <View style={styles.rescheduleButton}>
          <Body size="medium" weight="Bold" color={Colors.darkBrown2}>
            Reschedule
          </Body>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ScheduleSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight1,
    marginVertical: Spacings.s2,
    height: 100,
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
  timeContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescheduleButton: {
    backgroundColor: Colors.brownLight2,
    borderRadius: Spacings.s30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s30,
  },
});
