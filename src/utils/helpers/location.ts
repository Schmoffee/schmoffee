import Geolocation from '@react-native-community/geolocation';

function requestLocationPermission() {
  let allowed = false;
  Geolocation.requestAuthorization(
    () => {
      allowed = true;
      console.log('Location permission granted');
    },
    (error: {
      code: number;
      message: string;
      PERMISSION_DENIED: number;
      POSITION_UNAVAILABLE: number;
      TIMEOUT: number;
    }) => {
      console.log('Location permission denied');
      console.log(error);
    },
  );
  return allowed;
}

function watchLocation(): {watchId: number; curr_location: any} {
  let curr_location;
  const watchId = Geolocation.watchPosition(
    position => {
      curr_location = position.coords;
      console.log(position);
    },
    error => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 100,
      useSignificantChanges: true,
    },
  );

  return {watchId, curr_location};
}

export {requestLocationPermission, watchLocation};
