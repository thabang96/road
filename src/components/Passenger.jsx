import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getDistance } from 'geolib';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

const Passenger = () => {
  const [drivers, setDrivers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [driverDistance, setDriverDistance] = useState({});
  const [selectedCarNumber, setSelectedCarNumber] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'drivers'),
      (snapshot) => {
        const driversData = snapshot.docs.map(doc => doc.data());
        setDrivers(driversData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching drivers:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setError(error);
      }
    );
  }, []);

  const calculateDriverDistances = useMemo(() => {
    if (!currentLocation || drivers.length === 0) return {};
    const distanceInfo = {};
    drivers.forEach(driver => {
      if (driver.location) {
        const distance = getDistance(currentLocation, driver.location);
        const time = Math.ceil(distance / 1000 / 60); // Assuming average speed of 60 km/h
        distanceInfo[driver.carNumber] = { distance: distance / 1000, time: time };
      }
    });
    return distanceInfo;
  }, [currentLocation, drivers]);

  useEffect(() => {
    setDriverDistance(calculateDriverDistances);
  }, [calculateDriverDistances]);

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSelectedCarNumber(searchQuery);
    const filtered = drivers.filter((driver) =>
      driver.carNumber.toLowerCase().includes(searchQuery)
    );
    setFilteredDrivers(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Passenger View</h2>
      <LoadScript googleMapsApiKey='Googl_API'>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={currentLocation || defaultCenter}
        >
          {currentLocation && window.google && (
            <Marker
              position={currentLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              label="You"
            />
          )}
          {filteredDrivers
            .filter(driver => driver.isAvailable && driver.location)
            .map((driver, index) => (
              window.google && (
                <Marker
                  key={index}
                  position={driver.location}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  label={driver.carNumber}
                />
              )
            ))}
        </GoogleMap>
      </LoadScript>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by car number"
          value={selectedCarNumber}
          onChange={handleSearch}
          className="p-2 rounded-lg border border-gray-300 w-full font-semibold"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Available Cars</h3>
        <ul>
          {filteredDrivers
            .filter(driver => driver.isAvailable && driver.location)
            .map((driver) => (
              <li key={driver.carNumber} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                <div className="font-semibold">Car Number: {driver.carNumber}</div>
                <div>Distance: {driverDistance[driver.carNumber]?.distance.toFixed(2)} km</div>
                <div>Estimated Time: {driverDistance[driver.carNumber]?.time} minutes</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Passenger;
