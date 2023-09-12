import React, {useContext, useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {Image, Keyboard, Platform, StyleSheet, View} from 'react-native';
import {ShopMarker} from '../../../../utils/types/data.types';
import {MapContext} from '../../../../contexts';
import {Cafe} from '../../../../models';
import {getShops} from '../../../../utils/queries/datastore';
import LoadingPage from '../../screens/LoadingPage';
import MapMarker from '../../../coffee/components/map/MapMarker';
import MapViewDirections from 'react-native-maps-directions';
import MapNavigatorButton from './MapNavigatorButton';
import {MapAppName} from '../../../../utils/types/enums';
import {CARD_HEIGHT, HEIGHT, WIDTH} from '../../../../../constants';

interface MapProps {
  cafeIdFilter?: string;
  cafeLocationFilter: {latitude: number; longitude: number};
  preview?: boolean;
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
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCn17enS_Cmd-lm0diR8C3FPngjFogLl0M';

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
        latitude: props.cafeLocationFilter?.latitude,
        longitude: props.cafeLocationFilter?.longitude,
      });
    }

    fetchData().then(() => setMapLoading(false));
  }, [location, props.cafeLocationFilter?.latitude, props.cafeLocationFilter?.longitude]);

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
    <>
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
              console.log('Region changed');
              setRegion({
                ...region,
                latitude: parseFloat(region.latitude.toPrecision(6)),
                longitude: parseFloat(region.longitude.toPrecision(6)),
              });
            }
          } else {
            setRegion({
              ...region,
              latitude: parseFloat(region.latitude.toPrecision(6)),
              longitude: parseFloat(region.longitude.toPrecision(6)),
            });
          }
        }}
        region={currRegion ? currRegion : centredInfo.manuallyCentred ? currRegion : undefined}
        //focus only on map when map pressed
        onPress={() => mapPressed()}
        onPanDrag={() => mapDragged()}
        provider={PROVIDER_GOOGLE}
        style={styles.map}>
        {/*{destination && location && (*/}
        {/*  <MapViewDirections*/}
        {/*    origin={{*/}
        {/*      latitude: location.latitude,*/}
        {/*      longitude: location.longitude,*/}
        {/*    }}*/}
        {/*    destination={destination}*/}
        {/*    apikey={GOOGLE_MAPS_APIKEY}*/}
        {/*    mode="WALKING"*/}
        {/*    strokeWidth={3}*/}
        {/*    strokeColor="#000"*/}
        {/*  />*/}
        {/*)}*/}

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
        {/*<Marker*/}
        {/*  draggable*/}
        {/*  coordinate={{*/}
        {/*    latitude: location?.latitude ? location.latitude : 51.5131,*/}
        {/*    longitude: location?.longitude ? location.longitude : -0.1174,*/}
        {/*  }}*/}
        {/*  title={'You are here'}>*/}
        {/*  <View>*/}
        {/*    <Image*/}
        {/*      source={require('../../../../assets/pngs/x-outline.png')}*/}
        {/*      style={{width: 20, height: 20, resizeMode: 'cover'}}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*</Marker>*/}
      </MapView>
      <View style={props.preview ? styles.previewButton : styles.navigatorButton}>
        <MapNavigatorButton
          latitude={destination?.latitude}
          longitude={destination?.longitude}
          app={MapAppName.GOOGLE_MAPS}
        />
      </View>
    </>
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
  navigatorButton: {
    width: WIDTH - 70,
    position: 'absolute',
    bottom: HEIGHT / 2.1 - CARD_HEIGHT,
    left: 35,
    zIndex: 1,
    paddingBottom: 0,
  },
  previewButton: {
    height: 50,
    width: WIDTH * 0.6,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
});

export default Map;
