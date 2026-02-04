import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const MyOrdersPage = () => (
  <ProtectedRoute>
    <Profile section="My Orders" />
  </ProtectedRoute>
);

export default MyOrdersPage;
