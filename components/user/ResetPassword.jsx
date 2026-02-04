import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from '@/components/compat/router';
import axios from 'axios';
// import SimpleLayout from '../../layout/SimpleLayout';
import MainLayOut from '../../layout/MainLayOut';
import { themeBgColor } from '../../styles/typography';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // console.log('token', token);
    // console.log('email', email);
    // console.log('password', password);
    // console.log('confirmPassword', confirmPassword);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reset-password`, {
        token: token,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });
      // console.log('response', response);

      if (response.data.status) {
        setSuccess('Password has been reset successfully.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        if(response.data.message !== "Link Expired"){
          setError(response.data.error_message.password[0] || response.data.message || 'Something went wrong.');
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError('Error resetting password.');
    }
  };

  return (
 <MainLayOut>
<div className="flex items-center justify-center py-20 bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                className="w-full p-2 my-3 border border-gray-300 rounded-md mt-2 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 my-3 border border-gray-300 rounded-md mt-2 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`py-2 px-3 rounded-md ${themeBgColor} text-white font-medium m-auto block`}
            >
              Reset Password
            </button>
          </form>

          <div className="flex justify-between">
            <Link to={'/login'} className="text-blue-500 text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>
 </MainLayOut>
      

  );
};

export default ResetPassword;


