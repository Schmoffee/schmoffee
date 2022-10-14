
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SideDrawerRoutes } from '../../utils/types/navigation.types';
import { ChangePayment } from './screens/ChangePayment';
import Settings from './screens/Settings';

import { UpdateProfile } from './screens/UpdateProfile';

const Root = () => {
    const SideDrawerStack = createNativeStackNavigator<SideDrawerRoutes>();

    return (
        <SideDrawerStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true
            }}>
            <SideDrawerStack.Screen name="UpdateProfile" component={UpdateProfile} />
            <SideDrawerStack.Screen name="ChangePayment" component={ChangePayment} />
            <SideDrawerStack.Screen name="Settings" component={Settings} />
        </SideDrawerStack.Navigator>
    );
};

export default Root;
