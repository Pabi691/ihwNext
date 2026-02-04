import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const AddressesPage = () => (
  <ProtectedRoute>
    <Profile section="My Addresses" />
  </ProtectedRoute>
);

export default AddressesPage;
