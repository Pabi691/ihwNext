import React, { createContext, useContext, useRef, useState } from 'react';
import GuestInfoModal, { getGuestInfo } from '../components/GuestInfoModal';

const GuestCheckContext = createContext(null);

export const useGuestCheck = () => useContext(GuestCheckContext);

export const GuestCheckProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const pendingResolveRef = useRef(null);

  /**
   * Call before any cart / wishlist action.
   * Returns a Promise<boolean>:
   *   true  → user is logged in OR has already provided guest info → proceed
   *   false → user dismissed the modal → cancel the action
   */
  const requireGuestInfo = () => {
    // 'username' is only set on real login/register; the web token is always
    // stored as 'userToken' by AuthContext so that key is not a reliable signal.
    const isLoggedIn =
      typeof window !== 'undefined' && !!localStorage.getItem('username');
    if (isLoggedIn || getGuestInfo()) return Promise.resolve(true);

    return new Promise((resolve) => {
      pendingResolveRef.current = resolve;
      setShowModal(true);
    });
  };

  const handleSuccess = () => {
    setShowModal(false);
    if (pendingResolveRef.current) {
      pendingResolveRef.current(true);
      pendingResolveRef.current = null;
    }
  };

  const handleClose = () => {
    setShowModal(false);
    if (pendingResolveRef.current) {
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
    }
  };

  return (
    <GuestCheckContext.Provider value={{ requireGuestInfo }}>
      {children}
      {showModal && (
        <GuestInfoModal onSuccess={handleSuccess} onClose={handleClose} />
      )}
    </GuestCheckContext.Provider>
  );
};
