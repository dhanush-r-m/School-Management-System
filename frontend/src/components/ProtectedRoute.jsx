import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectTo = '/choose-user', children }) => {
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
};

export default ProtectedRoute;


