import React, {useContext} from 'react';
import {Cafe} from '../../../../models';
import {Pressable, StyleSheet, View} from 'react-native';
import {CARD_HEIGHT, CARD_WIDTH} from '../../../../../constants';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';
import {useNavigation} from '@react-navigation/native';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import FastImage from 'react-native-fast-image';
import {OrderingContext} from '../../../../contexts';
import {OrderingActionName} from '../../../../utils/types/enums';
import {setCurrentShopId} from '../../../../utils/helpers/storage';

interface CafeCardProps {
  cafe: Cafe;
}
const CafeCard = (props: CafeCardProps) => {
  const {ordering_dispatch} = useContext(OrderingContext);
  const {cafe} = props;
  const navigation = useNavigation<CoffeeRoutes>();

  async function handlePress() {
    ordering_dispatch({type: OrderingActionName.SET_CURRENT_SHOP_ID, payload: cafe.id});
    await setCurrentShopId(cafe.id);
    navigation.navigate('ShopPage');
  }

  return (
    <Pressable style={styles.root} onPress={() => handlePress()}>
      <View style={styles.cardImage}>
        <FastImage source={{uri: cafe.image ? cafe.image : undefined}} style={styles.image} />
      </View>
      <View style={styles.cafeDetails}>
        <Body size="medium" weight="Extrabld" color={Colors.black}>
          {cafe.name}
        </Body>
        <Body size="medium" weight="Regular" color={Colors.black}>
          {cafe.address}
        </Body>
        <Body size="medium" weight="Regular" color={Colors.black}>
          0.6miles away
        </Body>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Colors.grey,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 10,
  },
  cardImage: {
    width: '50%',
    height: '90%',
    backgroundColor: Colors.greyLight2,
    borderRadius: 10,
    margin: Spacings.s2,
  },
  cafeDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: Spacings.s3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CafeCard;
