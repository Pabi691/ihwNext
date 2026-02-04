import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = () => (
  <ProtectedRoute>
    <Profile section="My Profile" />
  </ProtectedRoute>
);

export default ProfilePage;
