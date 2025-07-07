import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './Dashboard/DashBoard';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import UserPosts from './pages/UserPosts';
import MyNetwork from './pages/MyNetwork';
import { useAuth } from './Context/AuthProvider';
import PrivateRoute from './PrivateRoute';
import toast, { Toaster } from 'react-hot-toast';
import SplitAuth from './pages/SplitAuth';

export default function App() {
  const [authUser]=useAuth();
  return (
    <>
      <Toaster />
      <Routes>
       
 <Route
          path="/auth"
          element={
              <>{!authUser?<SplitAuth />:<Navigate to="/dashboard"  />}</> 
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/userProfile/:id"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/userProfile/:id/posts"
          element={
            <PrivateRoute>
              <UserPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/network"
          element={
            <PrivateRoute>
              <MyNetwork />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
             !authUser? <Home />:<Navigate to="/dashboard" />
          }
        />
       

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}
