import React, { useEffect, useState } from 'react';
import dp from './../assets/dp.jpg'; // default profile
import { useDataContext } from '../Context/DataProvider';
import { useAuth } from '../Context/AuthProvider';
import { useConnections } from '../Context/ConnectionsProvider';
import NavBar from '../Dashboard/NavBar';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router';
import ShortProfile from '../Dashboard/ShortProfile';
import { motion } from "framer-motion";

export default function MyNetwork() {
  const [authUser] = useAuth();
    const navigate=useNavigate();
  const {myConnections,connectionRequests} =useConnections(); 

  // console.log(connectionRequests)
  // console.log(myConnections)
  
  const acceptedConnections = myConnections.filter(
  (conn) => conn.status_accepted === true
);
  const connections = acceptedConnections.map(conn => {
  const otherUser = conn.userId._id === authUser?.user._id ? conn.connectionId : conn.userId;
  return otherUser;
});
// console.log(connections)
const {activeTab, setActiveTab} = useDataContext();

  const PendingConnectionReq=myConnections.filter((user)=>{
    if(user.status_accepted ==null && user.userId._id!=authUser.user._id){
      return user;
    }
  })


  // console.log(PendingConnectionReq)
  async function handleRequest(e,id) {
    const token=authUser?.token?authUser.token:authUser?.user.token;
    // console.log(e.target.name)
    let result = await fetch("/api/user/accept_connection_req", {
                  method: "post",
                  Credentials:"include",
                  headers:{
                    'Content-Type': 'application/json',
                      authorization:`Bearer ${token}`,
                  },
                  body:JSON.stringify({action:e.target.name,requestId:id})
              })
               const data = await result.json();
              //  console.log(data)
              if(data.success){
            toast.success(data.msg)
        }
        if(!data.success){
           toast.error(data.msg)
        }
         setTimeout(() => {
         window.location.reload();
         }, 500); 
  }
  return (
   <> <NavBar/>
   <div className="p-4 flex lg:flex-row flex-col w-full h-screen  bg-gray-100">
      {/* Sidebar */}
     {/* Left Sidebar */}
        <aside className="hidden md:block col-span-1 space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white  rounded-2xl shadow p-4"
          >
            <ShortProfile user={authUser?.user} />
          </motion.div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-600 cursor-pointer">My Connections</li>
              <li className="hover:text-blue-600 cursor-pointer">My Posts</li>
              <li className="hover:text-blue-600 cursor-pointer">Messages</li>
              <li className="hover:text-blue-600 cursor-pointer">Notifications</li>
            </ul>
          </div>
        </aside>
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Tabs */}
       <div className="flex space-x-4 border-b pb-2">
  <button
    className={`pb-1 font-semibold ${
      activeTab === 'pending'
        ? 'border-b-2 border-blue-600 text-black'
        : 'text-gray-600 hover:text-black'
    }`}
    onClick={() => setActiveTab('pending')}
  >
    Invitations
  </button>

  <button
    className={`pb-1 font-semibold ${
      activeTab === 'connections'
        ? 'border-b-2 border-blue-600 text-black'
        : 'text-gray-600 hover:text-black'
    }`}
    onClick={() => setActiveTab('connections')}
  >
    My Connections
  </button>
</div>


        {/* Invitations */}
       {/* Conditional Content */}
{activeTab === 'pending' ? (
  <div className="mt-6 bg-white p-4 rounded-md shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold">
        Invitations ({PendingConnectionReq.length})
      </h3>
    </div>

    <div className="space-y-4">
      {PendingConnectionReq.length === 0 && (
        <p className="text-gray-500">No pending invitations.</p>
      )}

      {PendingConnectionReq.map((user) => (
        <div
          key={user.userId._id}
          className="flex items-center justify-between"
        >
          <div
            onClick={() => {
              navigate(`/userProfile/${user.userId._id}`);
            }}
            className="cursor-pointer flex items-center space-x-3"
          >
            <img
              src={
                user.userId.profilePicture
                  ? user.userId.profilePicture
                  : dp
              }
              alt="dp"
              className="h-12 w-12 rounded-full border"
            />
            <div>
              <p className="font-semibold">{user.userId.name}</p>
              <p className="text-sm text-gray-600">
                {user.userId.bio?.substring(0, 60) || 'No bio available...'}
              </p>
              <p className="text-sm text-gray-500">1 mutual connection</p>
            </div>
          </div>
          <div
            onClick={(e) => {
              handleRequest(e, user._id);
            }}
            className="space-x-2"
          >
            <button
              name="ignore"
              className="border px-4 py-1 rounded hover:bg-gray-100"
            >
              Ignore
            </button>
            <button
              name="accept"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="mt-6 bg-white p-4 rounded-md shadow">
    <h3 className="text-lg font-bold mb-4">
      My Connections ({connections.length})
    </h3>

    <div className="space-y-4">
      {connections.length === 0 && (
        <p className="text-gray-500">You have no connections yet.</p>
      )}

      {connections.map((user) => (
        <div
          key={user._id}
          onClick={() => navigate(`/userProfile/${user._id}`)}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : dp
            }
            alt="dp"
            className="h-12 w-12 rounded-full border"
          />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">
              {user.bio?.substring(0, 60) || 'No bio available...'}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div></>
  );
}
