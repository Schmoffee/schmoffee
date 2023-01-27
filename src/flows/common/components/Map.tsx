import React, {useContext, useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {Image, Keyboard, Platform, StyleSheet, View} from 'react-native';
import {ShopMarker} from '../../../utils/types/data.types';
import {MapContext} from '../../../contexts';
import {Cafe} from '../../../models';
import {getShops} from '../../../utils/queries/datastore';
import LoadingPage from '../screens/LoadingPage';
import MapMarker from '../../coffee/components/map/MapMarker';
import MapViewDirections from 'react-native-maps-directions';

interface MapProps {
  cafeIdFilter: string | null | undefined;
  cafeLocationFilter: {latitude: number; longitude: number} | null | undefined;
}

const Map = (props: MapProps) => {
  const mapRef = useRef<MapView | null>(null);
  const {location} = useContext(MapContext);
  const [mapLoading, setMapLoading] = useState(true);
  const [currRegion, setRegion] = useState<Region>();
  const [markers, setMarkers] = useState<ShopMarker[]>([]);
  const [centredInfo, setCentredInfo] = useState({manuallyCentred: false, userCentred: true});
  const currentMarkerSelected = useRef<number | null>(null);
  const destination = props.cafeLocationFilter;
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAeJAH2Ezqz7VwvjAAaEtkiAJ2K70iUhmU';

  useEffect(() => {
    async function fetchData() {
      const displayShops: Cafe[] = (await getShops(props.cafeIdFilter)) as Cafe[];
      const shopMarkers: ShopMarker[] = displayShops.map(shop => {
        return {
          name: shop.name,
          coords: {latitude: shop.latitude, longitude: shop.longitude},
          description: shop.description,
          is_open: shop.is_open,
          image: shop.image ? shop.image : '',
        };
      });
      setMarkers(shopMarkers);
      setRegion({
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        latitude: location?.latitude ? location.latitude : 51.5131,
        longitude: location?.longitude ? location.longitude : 0.1174,
      });
    }

    fetchData().then(() => setMapLoading(false));
  }, [location, props.cafeIdFilter]);

  /**
   * Dismiss the keyboard and search results when the map is clicked
   */
  const mapPressed = () => {
    setCentredInfo({manuallyCentred: false, userCentred: centredInfo.userCentred});
    Keyboard.dismiss();
  };

  const mapDragged = () => {
    mapPressed();
    setCentredInfo({manuallyCentred: centredInfo.manuallyCentred, userCentred: false});
  };

  return !mapLoading ? (
    <MapView
      ref={map => {
        mapRef.current = map;
      }}
      onRegionChangeComplete={region => {
        if (Platform.OS === 'ios') {
          if (
            region.latitude.toPrecision(6) !== currRegion?.latitude.toPrecision(6) &&
            region.longitude.toPrecision(6) !== currRegion?.longitude.toPrecision(6)
          ) {
            setRegion({
              ...region,
              latitude: parseFloat(region.latitude.toPrecision(6)),
              longitude: parseFloat(region.longitude.toPrecision(6)),
            });
          } else {
            setRegion({
              ...region,
              latitude: parseFloat(region.latitude.toPrecision(6)),
              longitude: parseFloat(region.longitude.toPrecision(6)),
            });
          }
        }
      }}
      region={currRegion ? currRegion : centredInfo.manuallyCentred ? currRegion : undefined}
      //focus only on map when map pressed
      onPress={() => mapPressed()}
      onPanDrag={() => mapDragged()}
      provider={PROVIDER_GOOGLE}
      style={styles.map}>
      {location && destination && (
        <MapViewDirections
          origin={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />
      )}

      {/*//map each of the shops to a marker on the map*/}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coords}
          pinColor={'navy'}
          title={marker.name}
          onPress={async () => {
            if (marker.is_open) {
              currentMarkerSelected.current = index;
            }
            mapPressed();
          }}>
          <View>
            <MapMarker isOpen={marker.is_open} isActive={currentMarkerSelected.current === index} />
          </View>
        </Marker>
      ))}
      <Marker
        draggable
        coordinate={{
          latitude: location?.latitude ? location.latitude : 51.5152,
          longitude: location?.longitude ? location.longitude : 0.1105,
        }}
        onDragEnd={e => console.log(e)}
        title={'You are here'}>
        <View>
          <Image
            source={require('../../../assets/pngs/schmoff_dino.png')}
            style={{width: 50, height: 50, resizeMode: 'cover'}}
          />
        </View>
      </Marker>
    </MapView>
  ) : (
    <LoadingPage />
  );
};

const styles = StyleSheet.create({
  map: {...StyleSheet.absoluteFillObject, flex: 1},
  closed: {color: 'coral', fontWeight: 'bold', top: 0},
  userMarker: {height: 70, width: 70},
  markerPointInfo: {
    // This is ONLY used for Detox: hiding the x/y coordinate details.
    opacity: 0, // Hiding it...
    width: 70,
    height: 70, // Matches the real dimensions of the real Marker
  },
});

export default Map;
