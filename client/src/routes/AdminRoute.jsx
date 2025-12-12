import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
