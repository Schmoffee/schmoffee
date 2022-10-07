import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-switch';
import { CONST_SCREEN_PREVIEW, CONST_SCREEN_WHEN } from '../../../../constants';
import { Colors, Spacings } from '../../../../theme';
import { Body } from '../../../../typography';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { OrderingContext } from '../../../contexts';
import { CoffeeRoutes } from '../../../utils/types/navigation.types';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


interface WhenPageProps { }

export const WhenPage = (props: WhenPageProps) => {
  const navigation = useNavigation<CoffeeRoutes>();
  const { ordering_state, ordering_dispatch } = useContext(OrderingContext)
  const [isEnabled, setIsEnabled] = useState(false);
  const data = [5, 10, 15, 20, 25, 30, 35, 40, 45]
  const [scheduledTime, setScheduleTime] = useState(data[0])
  const [focusedItem, setFocusedItem] = useState(0)



  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["1%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);


  const handleClosePress = useCallback(() => {
    setIsEnabled(false)
    setScheduleTime(data[0])
    ordering_dispatch({ type: 'SET_SCHEDULED_TIME', payload: scheduledTime })

    setFocusedItem(data[0])
    bottomSheetRef.current?.close();
  }, []);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState)
    if (isEnabled) {
      setScheduleTime(data[0])
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }
  const handleItemPress = useCallback((value: number) => {
    setScheduleTime(value)
    ordering_dispatch({ type: 'SET_SCHEDULED_TIME', payload: value })
    setFocusedItem(value)
  }, [setFocusedItem, setScheduleTime, ordering_dispatch]);

  const handleOnContinue = () => {
    ordering_dispatch({ type: 'SET_SCHEDULED_TIME', payload: scheduledTime })
    navigation.navigate(CONST_SCREEN_PREVIEW)
  }


  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={[styles.itemContainer, { backgroundColor: focusedItem === item ? Colors.blue : Colors.greenFaded2 }]}>
          <Body size='large' weight='Bold'>{item}</Body>
        </View>
      </TouchableOpacity >
    ),
    [handleItemPress, focusedItem]
  );


  return (

    <PageLayout
      header="When do you need it?"
      subHeader="Schedule your pick-up."
      footer={{
        buttonDisabled: isEnabled && !(focusedItem != 0),
        onPress: handleOnContinue,
        buttonText: isEnabled ? 'Schedule' : 'Continue',

      }}
      onPress={handleClosePress}
      showCircle
    >

      <View style={styles.container} >
        <View style={styles.textContainer} >
          <Body size='large' weight='Regular' color={Colors.darkBrown2}>Schedule for</Body>
          <Body size='medium' weight='Regular' color={Colors.brown2}>{`${ordering_state.scheduled_time}-${ordering_state.scheduled_time + 2} mins`}</Body>
        </View>
        <Switch
          barHeight={60}
          circleSize={45}
          renderInsideCircle={isEnabled ? () => <Body size='medium' weight='Bold' color={Colors.darkBrown2}>Schedule</Body> : () => <Body size='medium' weight='Bold' color={Colors.darkBrown2}>ASAP</Body>}
          value={isEnabled}
          onValueChange={toggleSwitch}
          disabled={false}
          backgroundActive={Colors.darkBrown2}
          backgroundInactive={Colors.brownFaded}
          circleActiveColor={Colors.goldFaded4}
          circleInActiveColor={Colors.goldFaded4}
          // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
          changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
          innerCircleStyle={{
            borderRadius: 20,
            borderWidth: 0,
            width: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }} // style for inner animated circle for what you (may) be rendering inside the circle
          outerCircleStyle={{}} // style for outer animated circle
          renderActiveText={false}
          renderInActiveText={false}
          switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
          switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
          switchWidthMultiplier={3} // multiplied by the `circleSize` prop to calculate total width of the Switch
          switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
        />
      </View>
      {isEnabled ? (

        <BlurView

          style={styles.absolute}
          blurType="dark"
          blurAmount={2}
          reducedTransparencyFallbackColor="white"
        />

      ) : null
      }

      <View style={styles.bottomSheetContainer}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backgroundStyle={styles.bottomSheetBackground}
          onClose={handleClosePress}
          enablePanDownToClose
        >
          <Body size='large' weight='Bold' color={Colors.darkBrown2} style={styles.bottomSheetHeader}>Schedule (mins)</Body>
          <BottomSheetFlatList
            data={data}
            keyExtractor={(i) => i}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        </BottomSheet>
      </View>

    </PageLayout >
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: Spacings.s6,

  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacings.s7,
    marginTop: Spacings.s10,
  },
  textContainer: {
    marginHorizontal: Spacings.s9,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 30
  },
  bottomSheetContainer: {
    height: '70%',
    marginBottom: Spacings.s20,
    elevation: 200,
    zIndex: 100,

  },
  itemContainer: {
    width: 200,
    height: 40,
    backgroundColor: Colors.goldFaded3,
    borderRadius: 10,
    marginVertical: Spacings.s1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.21
  },
  bottomSheetHeader: {
    marginTop: Spacings.s5,
    alignSelf: 'center',
    fontSize: 25,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.greyLight1,
  },
  absolute: {
    position: 'absolute',
    top: '-30%',
    left: 0,
    bottom: '30%',
    right: 0,
    borderRadius: 20,
  },


});
