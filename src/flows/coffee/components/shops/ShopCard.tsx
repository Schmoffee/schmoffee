import React from 'react';
import {Cafe} from '../../../../models';
import {Pressable, Text, View} from 'react-native';

interface CafeCardProps {
  cafe: Cafe;
}
const CafeCard = (props: CafeCardProps) => {
  const {cafe} = props;
  return (
    <Pressable>
      <View>
        <Text>{cafe.name}</Text>
        {/*<Text>{cafe.address}</Text>*/}
      </View>
    </Pressable>
  );
};

export default CafeCard;
