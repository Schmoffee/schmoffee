import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Pressable } from 'react-native';
import { Colors, Spacings } from '../../../common/theme';
import { CoffeeRoutes } from '../../../../utils/types/navigation.types';
import { CONST_SCREEN_WHEN } from '../../../../../constants';
import { OrderingContext } from '../../../../contexts';
import { Body, Heading } from '../../../common/typography';

interface ScheduleSectionProps { }

const ScheduleSection = (props: ScheduleSectionProps) => {
  const { ordering_state } = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();


  const getScheduleTime = (minutes: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    const hours = date.getHours();
    const minutes2 = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hours2 = hours % 12;
    const hours3 = hours2 ? hours2 : 12; // the hour '0' should be '12'
    const minutes3 = minutes2 < 10 ? '0' + minutes2 : minutes2;
    const strTime = hours3 + ':' + minutes3 + ' ' + ampm;
    return strTime;
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold" color={Colors.white}>
          Pick up time
        </Body>
      </View>
      <View style={styles.timeContainer}>

        <Pressable onPress={() => navigation.navigate(CONST_SCREEN_WHEN)}>
          <View style={styles.rescheduleButton}>
            <Heading size="default" weight="Regular" color={Colors.white}>
              {getScheduleTime(ordering_state.scheduled_time)}
            </Heading>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default ScheduleSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBrown,
    marginVertical: Spacings.s2,
    height: 100,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    marginHorizontal: Spacings.s5,
  },
  header: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: Spacings.s2,
  },
  timeContainer: {
    marginTop: Spacings.s3,
    justifyContent: 'center',
    alignItems: 'center',

  },
  rescheduleButton: {
    // backgroundColor: Colors.brownLight2,
    borderRadius: Spacings.s30,
    height: 50,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacings.s28,
    borderColor: Colors.white,
    borderWidth: 3,
  },
});
