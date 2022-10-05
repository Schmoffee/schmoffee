import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Dispatch} from 'react';
import {TrackOrderAction} from './types/data.types';

/**
 * Track the current user's location. Update it in the backend ans set the map center accordingly.
 * @param watchID
 * @param dispatch
 */
const subscribeToLocation = (watchID: {current: any}, dispatch: Dispatch<TrackOrderAction>) => {
  watchID.current = Geolocation.watchPosition(
    async (position: {coords: {longitude: any; latitude: any}}) => {
      dispatch({type: 'SET_LOCATION', payload: position.coords});
    },
    (error: any) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
    },
  );
};

/**
 * Platform dependent request for location access.
 */
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('whenInUse').then(async (res: any) => {
      console.log(res);
      return true;
    });
    return false;
  } else {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        buttonNegative: undefined,
        buttonNeutral: undefined,
        buttonPositive: '',
        title: 'Location Access Required',
        message: 'This app needs to access your location',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
};

export {requestLocationPermission, subscribeToLocation};
