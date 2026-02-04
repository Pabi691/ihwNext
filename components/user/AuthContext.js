import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from '@/components/compat/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isBrowser = typeof window !== "undefined";
  const [userToken, setUserToken] = useState(
    isBrowser ? localStorage.getItem("userToken") : null
  );
  const [localCartItems, setLocalCartItems] = useState(
    isBrowser ? JSON.parse(localStorage.getItem("localCart") || "[]") : []
  );
  // const uservarified = localStorage.getItem('uservarified');
  // const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN; // Default token for unauthenticated users
  const navigate = useNavigate();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isBrowser) return;
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [userToken, isBrowser]);

  // const decryptedToken = token
  // ? CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8) // Decrypt the token
  // : null;

  useEffect(() => {
    if (!isBrowser) return;
    if (apiUrl) {
      localStorage.setItem("apiurl", apiUrl);
    } else {
      localStorage.removeItem("apiurl");
    }
  }, [apiUrl, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    if (localCartItems.length === 0) {
      localStorage.removeItem("localCart");
    } else {
      localStorage.setItem("localCart", JSON.stringify(localCartItems));
    }
  }, [localCartItems, isBrowser]);

  const setToken = (token) => {
    setUserToken(token); 

    // if(uservarified === null) return;
    
    // if(uservarified && uservarified !== null ){
    //   navigate('/myaccount');
    //   window.location.reload();
    // }
    
    
  };

  const logout = () => {
    // Clear authentication-related states
    setUserToken(null);
    setLocalCartItems([]);

    // Remove all relevant localStorage and sessionStorage data
    if (isBrowser) {
      localStorage.clear();  // Clears all localStorage items
      sessionStorage.clear(); // Clears sessionStorage if used
    }

    // Redirect to login page
    navigate('/login');

    // Force reload to ensure session cleanup
    if (isBrowser) {
      window.location.reload();
    }
};

  

  // const getToken = () => userToken || webToken;

  return (
    <AuthContext.Provider value={{ userToken, setToken, logout, apiUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


