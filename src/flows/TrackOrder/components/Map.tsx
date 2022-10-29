import React, { useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { Platform, Text, View, Image, Keyboard, Alert, StyleSheet } from 'react-native';
import { Location, ShopMarker } from '../../../utils/types/data.types';
import { TrackOrderContext } from '../../../contexts';

interface MapProps {
  markers: ShopMarker[];
  region: Region | undefined;
}

const Map = (props: MapProps) => {
  const mapRef = useRef<MapView | null>(null);
  const { track_order_state, track_order_dispatch } = useContext(TrackOrderContext);
  /**
   * Dismiss the keyboard and search results when the map is clicked
   */
  const mapPressed = () => {
    track_order_dispatch({ type: 'SET_IS_MANUALLY_CENTERED', payload: false });
    Keyboard.dismiss();
  };

  const mapDragged = () => {
    mapPressed();
    track_order_dispatch({ type: 'SET_IS_USER_CENTERED', payload: false });
  };

  return (
    <MapView
      ref={map => {
        mapRef.current = map;
      }}
      onRegionChangeComplete={region => {
        if (Platform.OS === 'ios') {
          if (
            region.latitude.toPrecision(6) !== track_order_state.map_region?.latitude.toPrecision(6) &&
            region.longitude.toPrecision(6) !== track_order_state.map_region?.longitude.toPrecision(6)
          ) {
            track_order_dispatch({
              type: 'SET_MAP_REGION',
              payload: {
                ...region,
                latitude: parseFloat(region.latitude.toPrecision(6)),
                longitude: parseFloat(region.longitude.toPrecision(6)),
              },
            });
          } else {
            track_order_dispatch({
              type: 'SET_MAP_REGION',
              payload: {
                ...region,
                latitude: parseFloat(region.latitude.toPrecision(6)),
                longitude: parseFloat(region.longitude.toPrecision(6)),
              },
            });
          }
        }
      }}
      region={props.region ? props.region : track_order_state.manually_centered ? track_order_state.map_region: undefined}
      //focus only on map when map pressed
      onPress={() => mapPressed()}
      onPanDrag={() => mapDragged()}
      provider={PROVIDER_GOOGLE}
      style={styles.map}>
      {/*//map each of the shops to a marker on the map*/}
      {props.markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coords}
          pinColor={'navy'}
          title={marker.name}
          onPress={async () => {
            if (marker.is_open) {
              Alert.alert('marker pressed');
            }
            mapPressed();
          }}>
          {/*//closed markers appear grey*/}
          <View testID={'shop_marker_' + marker.name}>
            <Text style={styles.closed} testID="marker-text">
              {!marker.is_open ? 'Closed' : ''}
            </Text>
            {/*<CustomMapIcon isOpen={marker.is_open} />*/}
          </View>
          <Text style={styles.markerPointInfo} testID={'marker-point-info' + marker.name}>
            {JSON.stringify(mapRef.current?.pointForCoordinate(marker.coords))}
          </Text>
        </Marker>
      ))}
      {/*<Marker*/}
      {/*  draggable*/}
      {/*  coordinate={{*/}
      {/*    latitude: track_order_state.location?.latitude as number,*/}
      {/*    longitude: track_order_state.location?.longitude as number,*/}
      {/*  }}*/}
      {/*  onDragEnd={e => console.log(e)}*/}
      {/*  title={'You are here'}>*/}
      {/*  <View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
      {/*    /!*<Image source={require('../../assets/images/CurrentLocationMarkerFull.png')} style={styles.userMarker} />*!/*/}
      {/*  </View>*/}
      {/*</Marker>*/}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject, flex: 1 },
  closed: { color: 'coral', fontWeight: 'bold', top: 0 },
  userMarker: { height: 70, width: 70 },
  markerPointInfo: {
    // This is ONLY used for Detox: hiding the x/y coordinate details.
    opacity: 0, // Hiding it...
    width: 70, //
    height: 70, // Matches the real dimensions of the real Marker
  },
});

export default Map;
