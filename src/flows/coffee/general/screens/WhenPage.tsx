// import {useNavigation} from '@react-navigation/native';
// import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
// import {Pressable, StyleSheet, View} from 'react-native';
// import {Switch} from 'react-native-switch';
// import {CONST_SCREEN_PREVIEW} from '../../../../../constants';
// import {OrderingContext} from '../../../../contexts';
// import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
// import {BlurView} from '@react-native-community/blur';
// import {PageLayout} from '../../../common/components/PageLayout';
// import {Colors, Spacings} from '../../../common/theme';
// import {Body} from '../../../common/typography';
// import {OrderingActionName} from '../../../../utils/types/enums';
//
// interface WhenPageProps {}
//
// export const WhenPage = (props: WhenPageProps) => {
//   const navigation = useNavigation<CoffeeRoutes>();
//   const {ordering_state, ordering_dispatch} = useContext(OrderingContext);
//   const [isEnabled, setIsEnabled] = useState(false);
//   const snapPoints = useMemo(() => ['90%'], []);
//   const data = useMemo(() => {
//     return [8, 10, 15, 20, 25, 30, 35, 40, 45];
//   }, []);
//   const [scheduledTime, setScheduleTime] = useState(data[0]);
//   const [focusedIndex, setFocusedIndex] = useState(0);
//
//   const handleClosePress = useCallback(() => {
//     setIsEnabled(false);
//     setScheduleTime(data[0]);
//     ordering_dispatch({type: OrderingActionName.SET_SCHEDULED_TIME, payload: scheduledTime});
//     bottomSheetRef.current?.close();
//     setFocusedIndex(data[0]);
//   }, [data, ordering_dispatch, scheduledTime]);
//
//   const toggleSwitch = () => {
//     setIsEnabled(previousState => !previousState);
//     if (isEnabled) {
//       setScheduleTime(data[0]);
//       setFocusedIndex(0);
//       bottomSheetRef.current?.close();
//     } else {
//       bottomSheetRef.current?.snapToIndex(0);
//     }
//   };
//
//   const handleSheetChange = useCallback((index: any) => {
//     console.log('handleSheetChanges', index);
//   }, []);
//
//   // on changing wheel picker value
//   const handleOnValueChange = useCallback(
//     (value: number) => {
//       setScheduleTime(data[value]);
//       ordering_dispatch({type: OrderingActionName.SET_SCHEDULED_TIME, payload: data[value]});
//       setFocusedIndex(value);
//     },
//     [setFocusedIndex, setScheduleTime, ordering_dispatch],
//   );
//
//   const handleOnContinue = () => {
//     ordering_dispatch({type: OrderingActionName.SET_SCHEDULED_TIME, payload: scheduledTime});
//     navigation.navigate(CONST_SCREEN_PREVIEW);
//   };
//
//   const getDateString = (value: number) => {
//     const date = new Date();
//     let hours = date.getHours();
//     let minutes: string | number = date.getMinutes() + value;
//     let ampm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     if (minutes >= 60) {
//       hours = hours + 1;
//       minutes = minutes - 60;
//     }
//     let minuteString = minutes < 10 ? '0' + minutes.toString : minutes.toString;
//
//     return hours + ':' + minuteString + ' ' + ampm;
//   };
//
//   return (
//     <PageLayout
//       header="When do you need it?"
//       subHeader="Schedule your pick-up."
//       footer={{
//         buttonDisabled: isEnabled && !(focusedIndex != 0),
//         onPress: handleOnContinue,
//         buttonText: isEnabled ? 'Schedule' : 'Continue',
//       }}
//       onPress={handleClosePress}
//       showCircle>
//       <View style={styles.container}>
//         <View style={styles.textContainer}>
//           <Body size="large" weight="Regular" color={Colors.darkBrown2}>
//             Schedule for
//           </Body>
//           <Body size="medium" weight="Regular" color={Colors.brown2}>{`${ordering_state.scheduled_time}-${
//             ordering_state.scheduled_time + 2
//           } mins`}</Body>
//         </View>
//         <Switch
//           barHeight={60}
//           circleSize={45}
//           renderInsideCircle={
//             isEnabled
//               ? () => (
//                   <Body size="medium" weight="Bold" color={Colors.darkBrown2}>
//                     Schedule
//                   </Body>
//                 )
//               : () => (
//                   <Body size="medium" weight="Bold" color={Colors.darkBrown2}>
//                     ASAP
//                   </Body>
//                 )
//           }
//           value={isEnabled}
//           onValueChange={toggleSwitch}
//           disabled={false}
//           backgroundActive={Colors.darkBrown2}
//           backgroundInactive={Colors.brownFaded}
//           circleActiveColor={Colors.goldFaded4}
//           circleInActiveColor={Colors.goldFaded4}
//           // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
//           changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
//           innerCircleStyle={{
//             borderRadius: 25,
//             borderWidth: 0,
//             width: 70,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }} // style for inner animated circle for what you (may) be rendering inside the circle
//           containerStyle={styles.switchContainer} // style for outer animated circle
//           renderActiveText={false}
//           renderInActiveText={true}
//           switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
//           switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
//           switchWidthMultiplier={3} // multiplied by the `circleSize` prop to calculate total width of the Switch
//           switchBorderRadius={30}
//           inActiveText={'in a \nbit'}
//           inactiveTextStyle={styles.counterTextStyle} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
//         />
//       </View>
//       {isEnabled ? (
//         <BlurView style={styles.absolute} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="white" />
//       ) : null}
//
//       <View style={styles.bottomSheetContainer}>
//         <BottomSheet
//           index={-1}
//           ref={bottomSheetRef}
//           snapPoints={snapPoints}
//           onChange={handleSheetChange}
//           backgroundStyle={{}}
//           onClose={handleClosePress}
//           handleComponent={() => (
//             <Pressable onPress={handleClosePress}>
//               <View style={styles.bottomSheetHandleContainer}>
//                 <View style={styles.bottomSheetHandle} />
//               </View>
//             </Pressable>
//           )}>
//           <Body size="large" weight="Bold" color={Colors.darkBrown2} style={styles.bottomSheetHeader}>
//             Schedule (mins)
//           </Body>
//         </BottomSheet>
//       </View>
//     </PageLayout>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: Spacings.s7,
//     marginTop: Spacings.s10,
//   },
//   contentContainer: {
//     alignItems: 'center',
//     marginTop: Spacings.s6,
//   },
//   textContainer: {
//     marginHorizontal: Spacings.s9,
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     paddingVertical: 30,
//   },
//   switchContainer: {
//     width: 200,
//     height: 50,
//     borderRadius: 25,
//     borderWidth: 0,
//   },
//   bottomSheetContainer: {
//     height: '100%',
//     elevation: 200,
//     zIndex: 100,
//   },
//   bottomSheetHeaderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: Spacings.s7,
//   },
//
//   bottomSheetHeader: {
//     marginTop: Spacings.s5,
//     alignSelf: 'center',
//     fontSize: 25,
//   },
//   bottomSheetHandleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   bottomSheetHandle: {
//     width: 20,
//     height: 20,
//     borderRadius: 2.5,
//     backgroundColor: Colors.brown2,
//     marginTop: Spacings.s5,
//     marginRight: Spacings.s5,
//   },
//
//   itemContainer: {
//     fontSize: 30,
//     marginVertical: Spacings.s4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowRadius: 2,
//     shadowOpacity: 0.1,
//   },
//
//   absolute: {
//     position: 'absolute',
//     top: '-30%',
//     left: 0,
//     bottom: '30%',
//     right: 0,
//     borderRadius: 20,
//     height: '121%',
//   },
//   counterTextStyle: {
//     fontSize: 15,
//     color: Colors.white,
//     textAlign: 'center',
//     flexWrap: 'wrap',
//     position: 'absolute',
//     left: 105,
//   },
// });

export {};
