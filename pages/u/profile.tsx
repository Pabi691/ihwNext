import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const UserProfilePage = () => (
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
);

export default UserProfilePage;
