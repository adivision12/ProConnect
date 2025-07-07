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
    <div
      onClick={() => navigate("/profile")}
      className="cursor-pointer lg:h-[42%]  w-[95%] sm:w-[90%] md:w-[60%] lg:w-[25%] p-6 my-6 bg-white border-2 rounded-lg mx-auto lg:ml-2 shadow hover:shadow-lg transition"
    >
      {/* Banner */}
      <div className="h-[80px] w-full rounded overflow-hidden">
        <img
          src={authUser?.img ? authUser.img : defaultBanner}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Picture */}
      <img
        src={user?.profilePicture ? user.profilePicture : defaultDP}
        alt="profile"
        className="rounded-full h-[80px] w-[80px] border-2 border-white shadow-md object-cover relative top-[-35px] left-[20px]"
      />

      {/* User Info */}
      <div className="relative top-[-20px] pl-2">
        <h1 className="text-xl font-semibold">{user?.name || "Unnamed User"}</h1>
        <p className="text-sm text-gray-700">{user?.bio || "No bio provided"}</p>
        <p className="text-xs text-gray-500">{location ||"No location avl"}</p>
        
      </div>
    </div>
  );
}
