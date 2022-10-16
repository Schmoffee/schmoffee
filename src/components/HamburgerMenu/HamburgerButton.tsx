import React from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HamburgerButtonProps {
  navigation: any;
}

const HamburgerButton = (props: HamburgerButtonProps) => {
  return (
    <View style={styles.header}>
      <Pressable style={styles.floating_button} testID={'hamburger_menu_button'}>
        <Icon.Button
          onPress={() => props.navigation.openDrawer()}
          name="bars"
          color={'#046D66'}
          backgroundColor={'white'}
          underlayColor={'white'}
          style={styles.hamburger}
          size={0.04 * screenHeight}
          borderRadius={10}
        />
      </Pressable>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  header: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  floating_button: {
    opacity: 0,
    marginTop: screenHeight * 0.07,
    underlayColor: 'white',
    height: 0.07 * screenHeight,
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  hamburger: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 0,
    width: 0.14 * screenWidth,
    borderStyle: 'solid',
    borderColor: '#046D66',
    borderWidth: 2,
  },
});

export default HamburgerButton;
