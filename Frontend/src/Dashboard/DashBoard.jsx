import React from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import ShortProfile from "./ShortProfile";
import { useAuth } from "../Context/AuthProvider";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import Posts from "./Posts";
import Users from "./Users";
import { useDataContext } from "../Context/DataProvider";
import { useNavigate } from "react-router";
import ResetPasswordModal from "../Modals/ResetPasswordModal";

export default function Dashboard({ posts }) {
  const [authUser] = useAuth();
  const navigate=useNavigate();
const {activeTab, setActiveTab} = useDataContext();
const {passModal,setPassModal}=useDataContext();
  return (
    <div className="min-h-screen bg-gray-50  text-gray-900 00">
      {/* Navbar */}
      <NavBar/>
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 px-4">

        {/* Left Sidebar */}
        <aside className="hidden md:block col-span-1 space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white  rounded-2xl shadow p-4"
          >
            <ShortProfile user={authUser?.user} />
          </motion.div>

          <div className="bg-white  rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li onClick={()=>{setActiveTab('connections');
          navigate("/network")}} className="hover:text-blue-600 cursor-pointer">My Connections</li>
              <li onClick={()=>{navigate(`/userProfile/${authUser?.user._id}/posts`)}} className="hover:text-blue-600 cursor-pointer">My Posts</li>
              {/* <li className="hover:text-blue-600 cursor-pointer">Messages</li> */}
              {/* <li className="hover:text-blue-600 cursor-pointer">Notifications</li> */}
            </ul>
          </div>
        </aside>

        {/* Feed Section */}
        <main className="col-span-2 space-y-4">
          {/* Create Post */}
         

          {/* Posts Feed */}
        <Posts />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block col-span-1 space-y-4">
          <div className="bg-white  rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Trending Topics</h3>
            <ul className="space-y-2 text-sm">
              <li>#AI in Coding</li>
              <li>#100DaysOfDSA</li>
              <li>#WebDev2025</li>
            </ul>
          </div>

          <div className="bg-white  rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Suggested Connections</h3>
            {/* <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-600 cursor-pointer">Riya Sharma</li>
              <li className="hover:text-blue-600 cursor-pointer">Aman Verma</li>
              <li className="hover:text-blue-600 cursor-pointer">Sneha Patel</li>
            </ul> */}
            <Users/>
          </div>
        </aside>
      </div>
      {passModal && <ResetPasswordModal  />}
    </div>
  );
}
