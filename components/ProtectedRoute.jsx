import React, { useEffect, useState } from 'react';
import { Navigate } from '@/components/compat/router';
import { useAuth } from './user/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const guestToken = "2|SwAXG9wWqc4rwZPstwG42DUVpRhmkWjO5Vj2VpRF"; // Default guest token from env.js for reference

  // Check if token matches the guest/default token
  const isGuest = userToken === guestToken;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isVerified =
    typeof window !== "undefined" &&
    localStorage.getItem("uservarified") &&
    localStorage.getItem("uservarified") !== "null";

  return (userToken && !isGuest && isVerified) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

