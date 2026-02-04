import React, { useEffect, useState } from 'react';
import { Navigate } from '@/components/compat/router';
import { useAuth } from './user/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isVerified =
    typeof window !== "undefined" &&
    localStorage.getItem("uservarified") &&
    localStorage.getItem("uservarified") !== "null";

  return (userToken && isVerified) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

