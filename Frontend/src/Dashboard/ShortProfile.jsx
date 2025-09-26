import React, { useEffect, useState } from 'react';
import defaultBanner from './../assets/img.jpg';
import defaultDP from './../assets/dp.jpg';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate } from 'react-router';
import { useDataContext } from '../Context/DataProvider';

export default function ShortProfile() {
  const [authUser] = useAuth();
  const navigate = useNavigate();
  const {location} = useDataContext();
  const user = authUser?.user;

  return (
    

    // ShortProfile.jsx
<div
  onClick={() => navigate("/profile")}
  className="cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden"
>
  {/* Banner */}
  <div className="h-[100px] w-full bg-gradient-to-r from-blue-500 to-purple-500">
    <img
      src={authUser?.img || defaultBanner}
      alt="banner"
      className="w-full h-full object-cover opacity-80"
    />
  </div>

  {/* Profile Info */}
  <div className="p-4">
    <img
    referrerPolicy="no-referrer"
      src={user?.profilePicture || defaultDP}
      alt="profile"
      className="h-16 w-16 rounded-full border-4 border-white shadow-md -mt-10 relative z-10"
    />
    <h1 className="mt-2 text-lg font-semibold text-gray-800">{user?.name}</h1>
    <p className="text-sm text-gray-600">{user?.bio || "No bio provided"}</p>
    <p className="text-xs text-gray-400">{location || "No location available"}</p>
  </div>
</div>

  );
}
