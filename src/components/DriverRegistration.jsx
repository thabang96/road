import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { Link, useNavigate } from 'react-router-dom';

const DriverRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'drivers', user.uid), {
        email,
        carNumber,
        location: null,
        isAvailable: false,
      });

      console.log('Registered');
      navigate('/DriverDashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email address is already in use. Please sign in or use a different email.');
      } else {
        setError('Failed to register. Please try again.');
      }
      console.error('Error registering driver:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Driver Registration</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister} >
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Car Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Register
          </button>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account? <Link to="/DriverSignIn" className="underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DriverRegister;
