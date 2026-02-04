import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const MyAccountPage = () => (
  <ProtectedRoute>
    <Profile section="Overview" />
  </ProtectedRoute>
);

export default MyAccountPage;
