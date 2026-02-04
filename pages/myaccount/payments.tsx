import React from "react";
import Profile from "@/components/user/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const PaymentsPage = () => (
  <ProtectedRoute>
    <Profile section="My Payments" />
  </ProtectedRoute>
);

export default PaymentsPage;
