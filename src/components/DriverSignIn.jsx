import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';

const DriverSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/DriverDashboard');
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
    }
  };

  const handleUserTypeSelection = (type) => {
    if (type === 'passenger') {
      navigate('/Passenger');
    } else {
      setUserType(type);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {!userType && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Select User Type</h2>
            <button 
              className="w-full p-2 bg-blue-600 text-white rounded mb-2"
              onClick={() => handleUserTypeSelection('driver')}
            >
              Driver
            </button>
            <button 
              className="w-full p-2 bg-green-600 text-white rounded"
              onClick={() => handleUserTypeSelection('passenger')}
            >
              Passenger
            </button>
          </div>
        )}

        {userType === 'driver' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Driver Sign In</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignIn}>
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
                <p className="py-2">
                  Don't have an account yet? <Link to='/DriverRegistration' className='underline text-blue-600'>Sign Up</Link>
                </p>
              </div>
              <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
                Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverSignIn;
