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
    

    // Posts.jsx
   <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar p-1 space-y-6">
      {/* Create Post */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition w-full">
        <div className="flex items-center gap-3">
          <img
            src={authUser.user.profilePicture}
            alt="dp"
            className="h-12 w-12 rounded-full object-cover border"
          />
          <input
            onClick={() => setPostForm(true)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition"
            readOnly
          />
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-blue-600">
            <i className="fa-solid fa-video text-green-500" /> Video
          </button>
          <button className="flex items-center gap-2 hover:text-blue-600">
            <i className="fa-solid fa-image text-blue-500" /> Photo
          </button>
          <button className="flex items-center gap-2 hover:text-blue-600">
            <i className="fa-solid fa-lightbulb text-yellow-500" /> AI Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : allPosts.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-500 w-full">
          No posts yet
        </div>
      ) : (
        allPosts.map((post) => <PostCard post={post} key={post._id} />)
      )}

      {postForm && <CreatePost />}
    </div>


  );
}
