import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaVenusMars } from 'react-icons/fa';

export const GUEST_INFO_KEY = 'guestInfo';

export const getGuestInfo = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(GUEST_INFO_KEY) || 'null');
  } catch {
    return null;
  }
};

const GuestInfoModal = ({ onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.length < 2) errs.name = 'Enter your full name';
    if (!gender) errs.gender = 'Select your gender';
    if (!/^[0-9]{10}$/.test(mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const guestData = { name: name.trim(), gender, mobile };

    // Create a partial account so the lead appears in admin as Pending (not Active).
    // Using @noemail.ihw domain ensures the backend doesn't auto-verify the email.
    try {
      const tempEmail = `guest.${Date.now()}${mobile.slice(-4)}@noemail.ihw`;
      const tempPassword = `Ihw@${mobile}`;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/webuser/sign_up`,
        {
          username: tempEmail,
          password: tempPassword,
          name: guestData.name,
          gender: guestData.gender,
          mobile_number: guestData.mobile,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data?.status) {
        guestData.guestToken = res.data.user_token;
      }
    } catch (_) {
      // Silent fail — user can still proceed; "Almost There!" will handle sign_up
    }

    localStorage.setItem(GUEST_INFO_KEY, JSON.stringify(guestData));
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-6 py-5 text-center relative">
          <h2 className="text-white text-lg font-bold">Before You Continue</h2>
          <p className="text-blue-100 text-xs mt-1">Share a few quick details to add items</p>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white text-xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
              ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
              <FaUser size={13} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">⚠ {errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
              Gender
            </label>
            <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
              ${errors.gender ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
              <FaVenusMars size={14} className="text-gray-400 flex-shrink-0" />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex-1 py-3 bg-transparent text-sm text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">⚠ {errors.gender}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
              Mobile Number
            </label>
            <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
              ${errors.mobile ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
              <FaPhone size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-sm font-medium pr-1 border-r border-gray-300 mr-1">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1">⚠ {errors.mobile}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide
              bg-gradient-to-r from-[#04A9FF] to-[#0070cc]
              hover:from-[#0070cc] hover:to-[#004fa3]
              transition-all duration-200 shadow-lg shadow-[#04A9FF]/30
              disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : 'Continue'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Already have an account?{' '}
            <a href="/login" className="text-[#04A9FF] font-semibold hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default GuestInfoModal;
