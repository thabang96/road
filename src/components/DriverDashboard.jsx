import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'drivers', auth.currentUser.uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setIsAvailable(data.isAvailable);
        setLocation(data.location);
      } else {
        // Handle case where document doesn't exist
        console.log('Document does not exist');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleAvailability = async () => {
    const newIsAvailable = !isAvailable;
    const newLocation = newIsAvailable ? await getCurrentLocation() : null;

    await updateDoc(doc(db, 'drivers', auth.currentUser.uid), {
      isAvailable: newIsAvailable,
      location: newLocation,
    });

    setIsAvailable(newIsAvailable);
    setLocation(newLocation);
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Driver Dashboard</h2>
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faGlobe} className="mr-2 text-blue-500" />
        <p className="text-lg">{isAvailable ? 'Online' : 'Offline'}</p>
      </div>
      {location && (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-500" />
          <p className="text-lg">Latitude: {location.lat}, Longitude: {location.lng}</p>
        </div>
      )}
      <button
        onClick={handleToggleAvailability}
        className={`mt-8 p-2 rounded-lg ${isAvailable ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isAvailable ? 'Go Offline' : 'Go Online'}
      </button>
    </div>
  );
};

export default DriverDashboard;
