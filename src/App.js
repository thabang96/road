// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverRegistration from './components/DriverRegistration';
import DriverDashboard from './components/DriverDashboard';
import Passenger from './components/Passenger';
import DriverSignIn from './components/DriverSignIn';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    
    <Router>
      
      <div>
      <Routes>
          <Route path="/DriverRegistration" element={<DriverRegistration />} />
          <Route path="/DriverDashboard" element={user ? <DriverDashboard /> : <DriverSignIn />} />
          <Route path="/passenger" element={<Passenger />} />    
          <Route path='/' element={<DriverSignIn/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
