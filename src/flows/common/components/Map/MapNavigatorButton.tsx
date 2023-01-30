import React from 'react';
import { ActionButton } from '../Buttons/ActionButton';
import LaunchNavigator from 'react-native-launch-navigator';
import { Platform } from 'react-native';
import { MapAppName } from '../../../../utils/types/enums';

interface MapNavigatorButtonProps {
  latitude: number | undefined;
  longitude: number | undefined;
  app: MapAppName;
}

const MapNavigatorButton = (props: MapNavigatorButtonProps) => {
  function mapping(app: MapAppName) {
    switch (app) {
      case MapAppName.GOOGLE_MAPS:
        return LaunchNavigator.APP.GOOGLE_MAPS;
      case MapAppName.APPLE_MAPS:
        return LaunchNavigator.APP.APPLE_MAPS;
      case MapAppName.CITYMAPPER:
        return LaunchNavigator.APP.CITYMAPPER;
    }
  }

  function setGoogleAPIKey() {
    // @ts-ignore
    if (Platform.OS === 'android') LaunchNavigator.setGoogleApiKey('your_api_key');
  }

  function navigateTo(latitude: number, longitude: number, app: MapAppName) {
    const available = LaunchNavigator.isAppAvailable(app);
    setGoogleAPIKey();
    if (available) {
      LaunchNavigator.navigate([latitude, longitude], {
        app: mapping(app),
      })
        .then(() => console.log('Launched navigator'))
        .catch(err => console.error('Error launching navigator: ' + err));
    } else {
      console.log('App not available');
    }
  }

  function handlePress() {
    printAvailableApps();
    if (props.latitude && props.longitude) navigateTo(props.latitude, props.longitude, props.app);
  }

  function printAvailableApps() {
    LaunchNavigator.getAvailableApps()
      .then(apps => {
        for (let app in apps) {
          console.log(LaunchNavigator.getAppDisplayName(app) + ' is ' + (apps[app] ? 'available' : 'unavailable'));
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return <ActionButton label={'Open in maps'} onPress={handlePress} />;
};

export default MapNavigatorButton;
