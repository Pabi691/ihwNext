import React from "react";
import OrderDetails from "@/components/user/OrderDetails";
import ProtectedRoute from "@/components/ProtectedRoute";

const OrderDetailsPage = () => (
  <ProtectedRoute>
    <OrderDetails />
  </ProtectedRoute>
);

export default OrderDetailsPage;
