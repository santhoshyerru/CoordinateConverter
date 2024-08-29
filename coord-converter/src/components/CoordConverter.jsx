import React, { useState } from 'react';
import MapComponent from './MapComponent';

const CoordConverter = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [convertedCoords, setConvertedCoords] = useState('');

  const convertToDMS = (coord) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  const handleConvert = () => {
    const latDMS = convertToDMS(parseFloat(latitude));
    const lonDMS = convertToDMS(parseFloat(longitude));
    setConvertedCoords(`${latDMS} ${latitude >= 0 ? 'N' : 'S'}, ${lonDMS} ${longitude >= 0 ? 'E' : 'W'}`);
  };
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/save-coords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat: latitude, lng: longitude }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save coordinates');
      }

      const result = await response.json();
      alert(`Coordinates saved successfully with ID: ${result.id}`);
    } catch (error) {
      console.error('Error saving coordinates:', error);
      alert('Failed to save coordinates. Please try again.');
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Coordinate Converter</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
          Latitude (DD):
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="latitude"
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter latitude"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
          Longitude (DD):
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="longitude"
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter longitude"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleConvert}
      >
        Convert Coords
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSave}
      >
        Save Coords
      </button>
      {convertedCoords && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Converted Coordinates (DMS):</h2>
          <p>{convertedCoords}</p>
        </div>
      )} <MapComponent latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default CoordConverter;