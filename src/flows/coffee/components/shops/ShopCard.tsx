import React from 'react';
import {Cafe, Rating} from '../../../../models';
import {Pressable, StyleSheet, View} from 'react-native';
import {CARD_HEIGHT, CARD_WIDTH} from '../../../../../constants';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';
import {useNavigation} from '@react-navigation/native';
import {CoffeeRoutes} from '../../../../utils/types/navigation.types';
import FastImage from 'react-native-fast-image';

interface CafeCardProps {
  cafe: Cafe;
}
const CafeCard = (props: CafeCardProps) => {
  const {cafe} = props;
  const navigation = useNavigation<CoffeeRoutes>();

  return (
    <Pressable style={styles.root} onPress={() => navigation.navigate('ShopPage')}>
      <View style={styles.cardImage}>
        <FastImage source={{uri: cafe.image ? cafe.image : undefined}} />
      </View>
      <View style={styles.cafeDetails}>
        <Body size="medium" weight="Extrabld" color={Colors.black}>
          {cafe.name}
        </Body>
        <Body size="medium" weight="Regular" color={Colors.black}>
          N1 8RA
        </Body>
        <Body size="medium" weight="Regular" color={Colors.black}>
          3.3km
        </Body>
        {/* CAFE DESCRIPTION */}
        <Body size="small" weight="Regular" color={Colors.black}>
          {cafe.description}
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
});

export default CafeCard;
