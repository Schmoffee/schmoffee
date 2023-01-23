import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable} from 'react-native';

interface LeftChevronBackButtonProps {
  color: string;
}

const LeftChevronBackButton = (props: LeftChevronBackButtonProps) => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()} style={{paddingLeft: 30, paddingTop: 10}}>
      <Image
        source={require('../../../assets/pngs/left_chevron.png')}
        style={{width: 30, height: 30, tintColor: props.color ? props.color : '#fff'}}
      />
    </Pressable>
  );
};

export default LeftChevronBackButton;
