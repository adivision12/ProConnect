import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Context/AuthProvider';
import dp from './../assets/dp.jpg';
import { useNavigate } from 'react-router';
import { useDataContext } from '../Context/DataProvider';
import toast from 'react-hot-toast';
import SearchUser from './SearchUser';
import logo from "../assets/logo2.png";
import ResetPasswordModal from '../Modals/ResetPasswordModal';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef();
  const [authUser] = useAuth();
  const { setShowAllPosts } = useDataContext();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', icon: 'house', onClick: () => navigate('/dashboard') },
    { name: 'MyNetwork', icon: 'users', onClick: () => navigate('/network') },
  ];

  function openPosts(id) {
    navigate(`/userProfile/${id}/posts`);
  }

  function signOut() {
    localStorage.removeItem('user');
    toast.success("Signed out successfully");
    setTimeout(() => window.location.reload(), 500);
  }

  const {passModal,setPassModal}=useDataContext();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Logo */}
          <div onClick={() => navigate("/dashboard")} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="ProConnect Logo" className="h-10" />
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex w-[40%]">
            <SearchUser />
          </div>

          {/* Right: Nav + Profile */}
          <div className="flex items-center gap-6">

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  <i className={`fa-solid fa-${item.icon} text-lg`} />
                  <span className="mt-1">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Profile Avatar */}
            <div className="relative" ref={menuRef}>
              <img
                onClick={() => setOpen((o) => !o)}
                src={authUser?.user?.profilePicture || dp}
                alt="Me"
                className="h-9 w-9 rounded-full border cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              />

              {/* Dropdown Panel */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  
                  {/* User Info */}
                  <div className="p-4 flex items-center space-x-3 border-b border-gray-100">
                    <img
                      src={authUser?.user?.profilePicture || dp}
                      alt="Me"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{authUser?.user?.name}</p>
                      <p className="text-xs text-gray-500">{authUser?.user?.bio}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-2 space-y-2">
                    <button
                      onClick={() => { navigate('/profile'); setOpen(false); }}
                      className="w-full text-left text-sm py-1 px-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => { openPosts(authUser.user._id); setOpen(false); }}
                      className="w-full text-left text-sm py-1 hover:bg-gray-100 rounded"
                    >
                      Posts & Activity
                    </button>
                    <button
                      onClick={()=>{setPassModal(true); setOpen(false);}}
                      className="w-full text-left text-sm py-1 hover:bg-gray-100 rounded"
                    >
                      Reset Password
                    </button>
                  </div>

             
                  <hr className="my-2" />

                  {/* Sign Out */}
                  <div className="px-4 py-2">
                    <button
                      className="w-full text-left text-sm py-1 hover:bg-gray-100 rounded"
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
              onClick={() => setMobileMenu((m) => !m)}
            >
              <i className={`fa-solid fa-${mobileMenu ? 'xmark' : 'bars'} text-lg`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2 space-y-2">
          <SearchUser />
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { item.onClick(); setMobileMenu(false); }}
              className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded w-full"
            >
              <i className={`fa-solid fa-${item.icon} w-6`} />
              <span className="ml-2">{item.name}</span>
            </button>
          ))}

          <button
            onClick={() => { setOpen(true); setMobileMenu(false); }}
            className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded w-full"
          >
            <i className="fa-solid fa-user w-6" />
            <span className="ml-2">Profile</span>
          </button>
        </div>
      )}
    </nav>
  );
}
