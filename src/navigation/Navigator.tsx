import React, { useContext, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootRoutes } from '../utils/types/navigation.types';
import CoffeeRoot from '../flows/coffee/Root';
import AuthRoot from '../flows/authentication/Root';
import SideDrawerRoot from '../flows/hamburger/Root';
import TrackOrderRoot from '../flows/track/Root';
import { GlobalContext, MapContext } from '../contexts';
import { AuthState } from '../utils/types/enums';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission, watchLocation } from '../utils/helpers/location';
import { MapLocation } from '../utils/types/data.types';
import LoadingPage from '../flows/common/screens/LoadingPage';

interface NavigatorProps {
  loading: boolean;
}

export default function Navigator(props: NavigatorProps) {
  return (
    <NavigationContainer>
      <RootNavigator loading={props.loading} />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootRoutes>();

function RootNavigator(props: NavigatorProps) {
  const { global_state } = useContext(GlobalContext);
  const location = useRef<MapLocation | null>(null);

  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'auto',
    locationProvider: 'auto',
  });

  useEffect(() => {
    if (global_state.auth_state === AuthState.SIGNED_IN) {
      const success = requestLocationPermission();
      if (success) {
        const { watchId, curr_location } = watchLocation();
        location.current = curr_location;
        return () => Geolocation.clearWatch(watchId);
      }
    }
  }, [global_state.auth_state]);

  return (
    <MapContext.Provider value={{ location: location.current }}>
      <RootStack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          animation: 'none',
        }}>
        <RootStack.Group>
          {props.loading ? (
            <RootStack.Screen name="Loading" component={LoadingPage} />
          ) : global_state.auth_state !== AuthState.SIGNED_IN ? (
            <>
              <RootStack.Screen name="Coffee" component={CoffeeRoot} />
              <RootStack.Screen name="SideDrawer" component={SideDrawerRoot} />
              <RootStack.Screen name="TrackOrder" component={TrackOrderRoot} />
            </>
          ) : (
            <RootStack.Screen name="Auth" component={AuthRoot} />
          )}
        </RootStack.Group>
      </RootStack.Navigator>
    </MapContext.Provider>
  );
}
