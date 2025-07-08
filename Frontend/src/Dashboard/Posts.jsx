import React, { useState } from 'react';
import dp from './../assets/dp.jpg';
import { useAuth } from '../Context/AuthProvider';
import AllPosts from '../Users/Posts';
import { useDataContext } from '../Context/DataProvider';

import PostCard from './PostCard';
import CreatePost from './CreatePost';
export default function Posts() {
  
  const [allPosts, loading] = AllPosts();
   const {postForm, setPostForm} = useDataContext();
  //  const navigate=useNavigate();
  const [authUser] = useAuth();
  return (
    <div className="w-[95%] lg:w-[50%] mx-auto h-screen overflow-scroll scrollbar-hide">
      {/* Create Post Input Box */}
     
      <div className="border-2 p-6 bg-white m-6 rounded-lg">
        <div className="flex items-center space-x-4">
          <img
            src={authUser.user.profilePicture}
            alt="dp"
            className="border border-black rounded-full h-12 w-12 object-cover"
          />
          <input
            onClick={() => setPostForm(true)}
            type="text"
            placeholder="Start a post"
            className="w-full h-12 border border-gray-300 rounded-full px-4 cursor-pointer"
            readOnly
          />
        </div>
        <div className="flex justify-evenly text-md mt-4 text-gray-600">
          <p className="cursor-pointer">
            <i className="fa-solid fa-video text-green-500"></i>&nbsp;Video
          </p>
          <p className="cursor-pointer">
            <i className="fa-solid fa-image text-blue-500"></i>&nbsp;Photo
          </p>
          <p className="cursor-pointer">
            <i className="fa-solid fa-newspaper text-red-500"></i>&nbsp;Article
          </p>
        </div>
      </div>

      {/* Display Posts */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : allPosts.length === 0 ? (
        <div className="border-2 p-6 bg-white m-6 rounded-lg shadow-sm">
         No post
        </div>
      ) : (
        allPosts.map((post) => (
          <PostCard post={post} key={post._id}/>
        ))
      )}

      {/* Post Form Modal */}
      {postForm && (
        <CreatePost/>
      )}
    </div>
  );
}
