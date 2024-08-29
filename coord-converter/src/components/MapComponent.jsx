import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 27.7676,
  lng: -82.6403
};

function MapComponent({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY // Replace with your actual API key
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const showLocation = useCallback(() => {
    if (map && latitude && longitude) {
      const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      map.panTo(position);
      setMarker(position);
    }
  }, [map, latitude, longitude]);

  return isLoaded ? (
    <div className="mt-6">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      <button
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={showLocation}
      >
        Show Location on Map
      </button>
    </div>
  ) : <></>
}

export default React.memo(MapComponent);