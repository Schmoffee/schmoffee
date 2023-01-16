import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const LeftChevronBackButton = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 30, paddingTop: 10 }}
        >
            <Image
                source={require('../../../assets/pngs/left_chevron.png')}
                style={{ width: 30, height: 30, tintColor: '#fff' }}
            />
        </TouchableOpacity>
    );
};

export default LeftChevronBackButton;
