import * as React from 'react';
import {Image} from 'react-native';

interface MapMarkerProps {
  isOpen: boolean;
  isActive: boolean;
}
const MapMarker = (props: MapMarkerProps) => {
  const source = props.isOpen
    ? props.isActive
      ? require('../../../../assets/pngs/selected_shop_marker.png')
      : require('../../../../assets/pngs/open_shop_marker.png')
    : require('../../../../assets/pngs/closed_shop_marker.png');
  return <Image source={source} style={{width: 50, height: 50, resizeMode: 'cover'}} />;
};

export default MapMarker;
