import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable, Alert, Text} from 'react-native';
import {Colors, Spacings} from '../../../common/theme';
import {OrderingContext} from '../../../../contexts';
import {Body, Heading} from '../../../common/typography';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {OrderingActionName} from '../../../../utils/types/enums';

interface ScheduleSectionProps {
  setSchedule: (schedule: number) => void;
}

const ScheduleSection = (props: ScheduleSectionProps) => {
  const {ordering_dispatch} = useContext(OrderingContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const scheduled_time = useRef<number>(5);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    // get time difference in minutes
    const diff = Math.round((date.getTime() - new Date().getTime()) / 60000);
    console.log('diff', diff);
    if (diff < 5) {
      // show error
      Alert.alert(
        'Error',
        'Please select a time at least 5 minutes from now.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );

      hideDatePicker();
      return;
    }
    props.setSchedule(diff);
    scheduled_time.current = diff;
    ordering_dispatch({type: OrderingActionName.SET_SCHEDULED_TIME, payload: diff});

    hideDatePicker();
  };
  function getDateNow() {
    return new Date();
  }

  function getScheduleTime(minutes: number) {
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Body size="medium" weight="Bold" color={Colors.white}>
          Pick up time ({scheduled_time.current} min)
        </Body>
        <TouchableOpacity onPress={() => showDatePicker()}>
          <Body size="medium" weight="Bold" color={Colors.greyLight3}>
            Change
          </Body>
        </TouchableOpacity>
      </View>
      <View style={styles.timeContainer}>
        <Pressable onPress={showDatePicker}>
          <View style={styles.rescheduleButton}>
            <Heading size="default" weight="Regular" color={Colors.white}>
              {getScheduleTime(scheduled_time.current)}
            </Heading>
          </View>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={e => handleConfirmDate(e)}
          onCancel={hideDatePicker}
          minimumDate={getDateNow()}
          minuteInterval={5}
        />
      </View>
    </View>
  );
};

export default ScheduleSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBrown,
    height: 100,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    marginHorizontal: Spacings.s5,
    marginBottom: Spacings.s5,
    borderBottomColor: Colors.greyLight3,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    paddingBottom: Spacings.s30,
    paddingTop: Spacings.s6,
  },
  header: {
    height: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacings.s2,
    flexDirection: 'row',
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
