import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    console.log("ProtectedRoute: currentUser is null");
    console.log("ProtectedRoute: navigating to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // if (currentUser && !profileCompleted) {
  //   return <Navigate to="/profile-setup" replace />;
  // }

  else if (currentUser && !currentUser.emailVerified) {
    console.log("ProtectedRoute: currentUser.emailVerified is false");
    console.log("ProtectedRoute: navigating to /auth");
    return <Navigate to="/auth" replace />;
  } 

  return <Outlet />; // Render child routes
}

export default ProtectedRoute;