import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Close from 'react-native-vector-icons/AntDesign';
import { StyleSheet, Text } from 'react-native';

/**
 * Sidebar drawer and its contents
 */
function SideDrawerContent(props: any) {

    return (
        <DrawerContentScrollView {...props}>
            <Close.Button
                onPress={() => props.navigation.closeDrawer()}
                name="close"
                color={'#173C4F'}
                underlayColor={'transparent'}
                backgroundColor={'transparent'}
                size={25}
                style={styles.close_button}
            />
            <Text style={styles.welcome_text}>
                {/* Hi {context.currentUser.first_name}! */}
            </Text>
            <DrawerItem
                label="My orders"
                onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('Order history');
                }}
                activeTintColor="#2196f3"
                activeBackgroundColor="rgba(0, 0, 0, .04)"
                inactiveTintColor="rgba(0, 0, 0, .87)"
                inactiveBackgroundColor="transparent"
                style={styles.drawer_item}
                labelStyle={styles.drawer_item_label}
            />
            {/* {context.currBasket.data.length !== 0 ? (
                <DrawerItem
                    label="My basket"
                    onPress={() => {
                        props.navigation.closeDrawer();
                        props.navigation.navigate('Basket page');
                    }}
                    activeTintColor="#2196f3"
                    activeBackgroundColor="rgba(0, 0, 0, .04)"
                    inactiveTintColor="rgba(0, 0, 0, .87)"
                    inactiveBackgroundColor="transparent"
                    style={styles.drawer_item}
                    labelStyle={styles.drawer_item_label}
                />
            ) : null} */}
            <DrawerItem
                label="Change details"
                onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('Change details');
                }}
                activeTintColor="#2196f3"
                activeBackgroundColor="rgba(0, 0, 0, .04)"
                inactiveTintColor="rgba(0, 0, 0, .87)"
                inactiveBackgroundColor="transparent"
                style={styles.drawer_item}
                labelStyle={styles.drawer_item_label}
            />
            <DrawerItem
                label="Change password"
                onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('Change password');
                }}
                activeTintColor="#2196f3"
                activeBackgroundColor="rgba(0, 0, 0, .04)"
                inactiveTintColor="rgba(0, 0, 0, .87)"
                inactiveBackgroundColor="transparent"
                style={styles.drawer_item}
                labelStyle={styles.drawer_item_label}
            />
            <DrawerItem
                label="Logout"
                onPress={() => { }}
                activeTintColor="#2196f3"
                activeBackgroundColor="rgba(0, 0, 0, .04)"
                inactiveTintColor="rgba(0, 0, 0, .87)"
                inactiveBackgroundColor="transparent"
                style={styles.drawer_item}
                labelStyle={styles.drawer_item_label}
            />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawer_item: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#CECECE',
    },
    close_button: {
        alignSelf: 'flex-end',
    },
    drawer_item_label: {
        color: '#173C4F',
        fontSize: 17,
        fontWeight: '700',
        fontFamily: 'Poppins',
    },
    welcome_text: {
        marginLeft: '6%',
        fontWeight: 'bold',
        fontSize: 25,
        color: '#173C4F',
        marginVertical: 20,
    },
});

export default SideDrawerContent;
