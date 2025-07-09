import React from 'react'
import { useAuth } from '../Context/AuthProvider';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FaEllipsisH } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Comment({comment}) {
     const [open2,setOpen2]=useState("");
     const [authUser]=useAuth();
     const navigate=useNavigate();
      const onPostClick=async(id)=>{
    if(id===authUser.user._id){
      navigate("/profile")
      return;
    }
    //  setSelected(id);
            navigate(`/userProfile/${id}`)
  }
     useEffect(() => {
  const handleOutsideClick = () => {
    if (open2) setOpen2("");
    // if (open) setOpen(false);
  };
  if(open2) document.addEventListener("click", handleOutsideClick);
  return () => document.removeEventListener("click", handleOutsideClick);

}, [open2]);
async function handleDeleteComment(id) {
    // e.stopPropagation();
     const token=authUser.token?authUser.token:authUser.user.token;
    setOpen2(false);
        const response = await fetch("/api/delete_Comment", {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
                authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({commentId:id}),
        })
        
        const data = await response.json();
        // console.log(data);
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
    <div
  
  className="flex items-start gap-3 mt-4 p-2 rounded-lg hover:bg-gray-50 transition relative"
>
  <img
    onClick={() => onPostClick(comment.userId._id)}
    src={comment.userId.profilePicture}
    alt="Commenter"
    className="h-10 w-10 rounded-full object-cover border border-gray-300"
  />
  <div
    onClick={() => onPostClick(comment.userId._id)}
    className="flex-1 bg-gray-100 rounded-lg px-4 py-2"
  >
    <h4 className="font-semibold text-sm text-gray-800">{comment.userId.name}</h4>
    <p className="text-xs text-gray-500">{comment.userId.bio}</p>
    <p className="text-sm mt-1 text-gray-700">{comment.body}</p>
  </div>

  <div className="relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpen2(prev => prev === comment._id ? "" : comment._id);
      }}
      className="p-1 text-gray-500 hover:bg-gray-200 rounded-full transition z-50"
    >
      <FaEllipsisH />
    </button>

    {open2 === comment._id && (
      <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
        {comment.userId._id === authUser.user._id ? (
          <>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Copy Comment
            </button>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="block w-full text-left px-4 py-2 hover:bg-red-100"
            >
              Delete Comment
            </button>
          </>
        ) : (
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Copy Comment
          </button>
        )}
      </div>
    )}
  </div>
</div>
  )
}
