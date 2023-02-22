import React, {useContext} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {HEIGHT, WIDTH} from '../../../../constants';
import {Colors} from '../../common/theme';
import {Body, Heading} from '../../common/typography';
import {getNiceTime} from '../../../utils/helpers/others';
import {GlobalContext} from '../../../contexts';
interface CurrentOrderBannerProps {}

const CurrentOrderBanner = (props: CurrentOrderBannerProps) => {
  const {global_state} = useContext(GlobalContext);
  const order = global_state.current_order;

  return (
    order && (
      <Pressable onPress={() => {}}>
        <View style={styles.root}>
          <View style={styles.container}>
            <View style={styles.cafe}>
              <Heading size="small" weight="Bold" color={Colors.black}>
                KINGS CAFE
              </Heading>
              <Body size="large" weight="Bold" color={Colors.greyLight3}>
                Pickup time
              </Body>
            </View>

            <View style={styles.time}>
              <Heading size="small" weight="Extrabld" color={'green'} style={{marginTop: 10}}>
                {order?.status}
              </Heading>
              <Heading size="small" weight="Extrabld" color={Colors.black}>
                {getNiceTime(order?.order_info.scheduled_times[0] as string)}
              </Heading>
            </View>
          </View>
          <View style={styles.moreInfo}>
            <Body size="small" weight="Regular" color={Colors.black}>
              More Info{'>>'}
            </Body>
          </View>
        </View>
      </Pressable>
    )
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    height: HEIGHT / 7,
    backgroundColor: Colors.greyLight2,
    opacity: 0.9,
    width: WIDTH / 1.2,
    borderRadius: 20,
    // justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  cafe: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    height: '80%',
    width: '60%',
    borderBottomWidth: 1,
  },
  time: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80%',
    width: '40%',
    borderBottomWidth: 1,
  },
  moreInfo: {
    position: 'absolute',
    bottom: 5,
    left: '13%',
    // backgroundColor: 'green',
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrentOrderBanner;
