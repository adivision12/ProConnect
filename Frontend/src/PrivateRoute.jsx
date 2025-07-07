import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthProvider';

const PrivateRoute = ({ children }) => {
  const [authUser] = useAuth();

  if (!authUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
