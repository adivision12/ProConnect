import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Context/AuthProvider';
import dp from './../assets/dp.jpg'
import { useNavigate } from 'react-router';
import { useDataContext } from '../Context/DataProvider';
import toast from 'react-hot-toast';
import SearchUser from './SearchUser';
import logo from "../assets/logo2.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef();
   const [authUser]=useAuth();
   const {setShowAllPosts}=useDataContext();
   const navigate=useNavigate();
  // close profile dropdown when clicking outside
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
    { name: 'Home', icon: 'house'  , onClick:()=>{navigate('/dashboard')} },
    { name: 'MyNetwork', icon: 'users' , onClick:()=>{navigate('/network')} },
   
  ];

 
  function openPosts(id){
    navigate(`/userProfile/${id}/posts`)
  }
  function signOut(){
    // console.log("sign out")
    localStorage.removeItem('user');
    toast.success("Sign Out successfully")
    setTimeout(()=>{
      window.location.reload();
    },500)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-bold text-blue-600 text-2xl">   <img src={logo} alt="ProConnect Logo" className="h-12" /></h1>
          </div>

     <div className='hidden md:flex lg:w-[50%] '>
            <SearchUser/>
     </div>
          {/* </div> */}

          {/* Right */}
          <div className="flex items-center gap-4 space-x-4">
            {/* Desktop Nav Icons */}
            <div className="hidden md:flex  items-center space-x-8 text-gray-600">
              {navItems.map((item) => (
                <div onClick={item.onClick}
                  key={item.name}
                  className="flex flex-col items-center text-sm  hover:text-black cursor-pointer"
                >
                  <i className={`fa-solid fa-${item.icon} text-lg`} />
                  <span className="mt-1">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Profile Trigger */}
            <div className="relative" onClick={() => setOpen((o) => !o)} ref={menuRef}>
              <button
                
                className="flex flex-col items-center focus:outline-none"
              >
               {authUser? <img
                  src={ authUser.user?.profilePicture}
                  alt="Me"
                  className="w-8 h-8 rounded-full"
                />: <img
                  src={dp}
                  alt="Me"
                  className="w-8 h-8 rounded-full"
                />}
                <span className="mt-1 text-sm hidden md:block">Me</span>
              </button>

              {/* Dropdown Panel */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  {/* (same contents as before) */}
                  <div className="p-4 flex items-center space-x-3">
                                 {authUser? <img
                  src={ authUser.user?.profilePicture}
                  alt="Me"
                  className="w-8 h-8 rounded-full"
                />: <img
                  src={dp}
                  alt="Me"
                  className="w-8 h-8 rounded-full"
                />}
                    <div className="flex-1">
                      <p className="font-medium">{authUser.user.name}</p>
                      <p className="text-xs text-gray-500">
                       {authUser.user.bio}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 space-y-2">
                    <button onClick={()=>{navigate('/profile')}} className="w-full text-left text-sm py-1 px-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                      View Profile
                    </button>
                  
                  </div>
                 
                  <hr className="my-3" />
                  <div className="px-4 space-y-1 text-sm">
                    <p className="font-medium text-gray-700">Manage</p>
                    <a onClick={()=>openPosts(authUser.user._id)} className="block hover:underline text-gray-600">
                      Posts & Activity
                    </a>
                    <a href="#jobs" className="block hover:underline text-gray-600">
                      Job Posting Account
                    </a>
                    <button
                      className="w-full text-left text-sm py-1 hover:bg-gray-100 rounded"
                      onClick={() => {signOut()}}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
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
       <> 
          <SearchUser/>
          
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                onClick={item.onClick}
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                <i className={`fa-solid fa-${item.icon} w-6`} />
                <span className="ml-2">{item.name}</span>
              </a>
            ))}
            <a
              href="#profile"
              onClick={() => { setOpen(true); setMobileMenu(false); }}
              className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <i className="fa-solid fa-user w-6" />
              <span className="ml-2">Profile</span>
            </a> 
          </div> 
        </div> </>
      )}
    </nav>
  );
}
