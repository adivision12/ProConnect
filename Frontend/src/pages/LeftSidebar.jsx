import React from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router";
import { useDataContext } from "../Context/DataProvider";

export default function LeftSidebar({user}) {
  const [authUser] = useAuth();
  const navigate = useNavigate();
const {isOpen, setIsOpen}=useDataContext();
  // Example profile strength calculation
  const completedSections = [
    user.userId?.bio,
    user?.userId?.skills?.length > 0 ? true : false,
    user?.userId?.acheivements?.length > 0 ? true : false,

    user?.education.length > 0 ? true : false,
    user?.pastWork.length > 0 ? true : false,
  ].filter(Boolean).length;

  // console.log("user in sidebar", user?.userId?.bio,
  //   user?.userId.profilePicture,
  //   user?.education,
  //   user?.pastWork);
    // console.log("curr user", user);
  const strength = (completedSections / 4) * 100;
  // console.log("strength", strength);
const {activeTab, setActiveTab} = useDataContext();

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      {/* Mini Profile Card */}
      <div className="flex flex-col items-center text-center">
        <img
          src={user?.userId?.profilePicture}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-blue-100"
        />
        <h3 className="mt-2 font-bold">{user?.name}</h3>
        <p className="text-sm text-gray-600">
          {user.userId?.bio|| "Aspiring Software Engineer"}
        </p>
      </div>

      {/* Profile Strength */}
      <div>
        <p className="text-sm font-semibold mb-1">Profile Strength</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${strength}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{strength}% completed</p>
      </div>

      {/* Quick Links */}
    { user?.userId._id===authUser?.user._id ? <div className="">
        <button onClick={()=>{setIsOpen(true)}} className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100">
          ✏️ Edit Profile
        </button>
        <button onClick={()=>{navigate(`/userProfile/${user?.userId._id}/posts`)}} className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100">
          📌 Saved Posts
        </button>
        <button onClick={()=>{setActiveTab('connections');
          navigate("/network")}} className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100">
          👥 My Connections
        </button>
      </div>:
  
      <div className="space-y-2">
        <p className="text-sm font-semibold">Analytics</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>👀 Profile Views</span>
          <span className="font-bold">120</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>🤝 Connections</span>
          <span className="font-bold">350</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>📈 Post Reach</span>
          <span className="font-bold">1.2k</span>
        </div>
      </div>
      }

      {/* Achievements */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Achievements</h4>
        <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
          <li>Solved 500+ DSA Problems</li>
          <li>Topper in CSE Department</li>
          <li>Built multiple MERN projects</li>
        </ul>
      </div>
    </div>
    
  );
}
