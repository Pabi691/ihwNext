import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../global/GlobalContext';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { themeBgColor } from '../../styles/typography';

const MyProfile = () => {
  const { token } = useGlobal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_customer_details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);

        if (response.data.status) {
          setProfile(response.data.customer_data);
          setUpdatedProfile(response.data.customer_data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      // const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/update_customer_profile`, updatedProfile, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>My Profile</h2>
      {loading ? (
        <Skeleton count={8} height={40} className='mb-3' />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium'>Full Name</label>
            <input
              type='text'
              name='first_name'
              value={updatedProfile.first_name || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04A9FF]`}
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Gender</label>
            <input
              type='text'
              value={profile.gender}
              disabled
              className='w-full px-3 py-2 border bg-gray-100 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>DOB</label>
            <input
              type='text'
              value={profile.dob}
              disabled
              className='w-full px-3 py-2 border bg-gray-100 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={updatedProfile.email || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border bg-gray-100 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Mobile Number</label>
            <input
              type='text'
              value={profile.mobile_number}
              disabled={!isEditing}
              className='w-full px-3 py-2 border bg-gray-100 rounded-lg'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium'>Alternate Mobile Number</label>
            <input
              type='text'
              name='alt_mob_number'
              value={updatedProfile.alt_mob_number || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Address Line 1</label>
            <input
              type='text'
              name='address_line_1'
              value={updatedProfile.address_line_1 || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>City</label>
            <input
              type='text'
              name='city'
              value={updatedProfile.city || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>State</label>
            <input
              type='text'
              name='state'
              value={updatedProfile.state || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Zip Code</label>
            <input
              type='text'
              name='zip_code'
              value={updatedProfile.zip_code || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Country</label>
            <input
              type='text'
              name='country'
              value={updatedProfile.country || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      )}
      <div className='flex justify-end mt-4'>
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className={`px-4 py-2 ${themeBgColor} text-white rounded-lg hover:bg-blue-600 transition`}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className='ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition'
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition'
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
