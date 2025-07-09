import React, { useState } from 'react'
import { useAuth } from '../Context/AuthProvider';
import { useNavigate } from 'react-router';
import useController from '../stateManagement/useController';
import {
  FaThumbsUp,
  FaCommentAlt,
  FaShare,
  FaPaperPlane,
  FaEllipsisH,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import Comment from './Comment';
import { getTimeAgo } from '../utils/getTimeAgo';
import Loading from './Loading';
import { useLocation } from 'react-router-dom';

export default function PostCard({post}) {
      const [authUser] = useAuth();
      const [openComment,setOpenComment]=useState(false);
       const navigate=useNavigate();
       const [open,setOpen]=useState(false);
       const [isLoading,setIsLoading]=useState(false);
       const [comment,setComment]=useState("");
       const [postComments,setPostComments]=useState([])
       const {setSelected}=useController();
       const [postForm, setPostForm] = useState(false);
        const [formData, setFormData] = useState({
           body: post.body || '',
           media: post.media || '',
         });
  const onPostClick=async(id)=>{
    if(id===authUser.user._id){
      navigate("/profile")
      return;
    }
     setSelected(id);
            navigate(`/userProfile/${id}`)
  }
   function handleInput(e) {
    setComment(e.target.value);
  }
  useEffect(()=>{
    const getPostComment=async()=>{
       let result = await fetch(`/api/get_post_comments?postId=${post._id}`, {
                method: "Get",
                Credentials:"include",
                headers:{
                    'Content-Type': 'application/json',
                },
            })
             const data = await result.json();
            // console.log("comment ",data);
            data.reverse();
            setPostComments(data);
    }
    getPostComment();
  },[])

  async function deletePost(id) {
     const token=authUser.token?authUser.token:authUser.user.token;
     setIsLoading(true);
    setOpen(false);
        const response = await fetch("/api/delete_Post", {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
                authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({postId:id}),
        })
        setIsLoading(false)
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
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
     const token=authUser.token?authUser.token:authUser.user.token;
     setIsLoading(true)
    setOpen(false);
    const postData = new FormData();
    postData.append('media', formData.media);
    postData.append('body', formData.body);
    console.log(postData)
        const response = await fetch(`/api/edit_Post?postId=${post._id}`, {
            method: "post",
            headers: {
                authorization:`Bearer ${token}`,
            },
            body: postData,
        })
        setIsLoading(false)
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
 const [showFull, setShowFull] = useState(false);
  async function handleComment(e){
     const token=authUser.token?authUser.token:authUser.user.token;
    e.stopPropagation();
    // console.log(comment);
      let result = await fetch(`/api/post_comments`, {
                method: "POST",
                Credentials:"include",
                headers:{
                    'Content-Type': 'application/json',
                     authorization:`Bearer ${token}`,
                },
                body:JSON.stringify({comment,postId:post._id})
            })
             const data = await result.json();
            // console.log(data);
             if(data.success){
            toast.success(data.msg)
        }
        if(!data.success){
           toast.error(data.msg)
        }
         setTimeout(() => {
         setComment("");
         }, 500); 

            // setComment("");
  }

  
  const [isLiked,setIsLiked]=useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

useEffect(() => {
  setIsLiked(post.likes?.includes(authUser.user._id));
}, [post.likes, authUser.user._id]);

const likeToggle = async (id) => {
  const token = authUser.token || authUser.user.token;

  try {
    const response = await fetch("/api/increment_likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    console.log(isLiked);

    if (data.success) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } else {
      toast.error("Failed to like post");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    toast.error("Something went wrong");
  }
};
const handleCopyLink = async (postId, userId) => {
  const postUrl = `${window.location.origin}/userProfile/${userId}/posts?postId=${postId}`;

  try {
    await navigator.clipboard.writeText(postUrl);
    toast.success('Post link copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy link');
    console.error(error);
  }
};
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const targetPostId = params.get('postId');

  if (targetPostId) {
    const el = document.getElementById(`post-${targetPostId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}, []);

  return (
    <div 
      
      className="bg-white border border-gray-200 rounded-lg shadow-sm m-6 overflow-hidden"
   >
      {/* Header */}
      {isLoading && <Loading/>}
      <div  id={`post-${post._id}`} className="flex items-start px-6 py-4">
        <img
          onClick={() => onPostClick(post.userId._id)} src={post.userId.profilePicture}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover border border-gray-300"
        />
        <div className="flex-1 ml-4">
          <div className="flex items-center justify-between">
            <div  onClick={() => onPostClick(post.userId._id)}>
              <h2 className="font-semibold text-lg">{post.userId.name}</h2>
              <p className="text-sm text-gray-600">{post.userId.bio}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {getTimeAgo(post.createdAt) /* format this as “4 days ago” */}
              </p>
            </div>
           
          <div className="relative">
  <button
    onClick={() => {
      setOpen((o) => !o)
    }}
    className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"
  >
    <FaEllipsisH />
  </button>

  {open &&  (
  (post.userId._id == authUser.user._id )?
     <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <button
        onClick={() => {
         setPostForm(true)
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        ✏️ Edit Post
      </button>
      <button
        onClick={() => {
          deletePost(post._id)
        }}
        className="block w-full text-left px-4 py-2 hover:bg-red-100 "
      >
        🗑️ Delete Post
      </button>
    </div>: <div  className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
 <button onClick={() => handleCopyLink(post._id, post.userId._id)}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Copy post link
      </button>
    </div>
    
  )}
</div>

          </div>
        </div>
      </div>
{postForm &&
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    {isLoading && <Loading/>}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setPostForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  What's on your mind?
                </label>
                <textarea
                  name="body"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Add Image
                </label>
                <input
                  type="file"
                  name="media"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPostForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
}
      {/* Body */}
      <div className="px-6 pb-4">
       <p className={`text-gray-800 text-sm leading-relaxed ${!showFull ? 'line-clamp-1' : ''}`}>
  {post.body}
</p>

{post.body.length > 100 && !showFull && (
  <span
    onClick={() => setShowFull(true)}
    className="text-blue-600 cursor-pointer hover:underline ml-6 text-sm"
  >Read more
  </span>
)}
      </div>
      {/* Media */}
      {post.media && (
        <div className="w-full">
          <img
            src={post.media}
            alt="Post media"
            className="w-full max-h-[300px] object-cover"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="px-6 py-2 flex items-center justify-between text-gray-600 text-sm">
        <div className="flex items-center space-x-1">
         <FaThumbsUp className={`${isLiked ? 'text-blue-600' : ''}`} />
<span>{likesCount}</span>
        </div>
        {/* Could show comment count, share count here */}
        {postComments.length>0 && <div onClick={()=>setOpenComment(true)} className=' cursor-pointer'> {postComments.length} 
          <span> comments</span>
        </div>}
      </div>
      <hr />

      {/* Actions */}
      <div className="px-6 py-2 flex justify-between text-gray-600">
        <button onClick={()=>likeToggle(post._id)}  className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded w-full justify-center">
         <FaThumbsUp className={isLiked ? 'text-blue-600' : ''} />
          <span className={`text-sm`} >Like</span>
        </button>
        <button onClick={()=>setOpenComment(true)} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded w-full justify-center">
          <FaCommentAlt />
          <span className="text-sm">Comment</span>
        </button>
     
      </div>
      <div className={`flex  ${openComment?'block':'hidden'}`}>
        &nbsp;&nbsp;
         <img
          src={authUser.user.profilePicture}
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover border border-gray-300 my-2"
        /> &nbsp;&nbsp;
    
         <form onSubmit={handleComment} className='w-[85%] border-gray-500 h-12 border-2 rounded-full  my-2'>
<input onChange={handleInput} type="text" placeholder='Add a comment' className='w-[90%] mt-1 outline-none rounded-full px-2' />
       <button> <i  className="fa-solid fa-paper-plane text-2xl cursor-pointer"></i></button>
        </form>
       
      </div>
      {openComment && (
  <div className="px-6 py-4">
    {postComments.length > 0 && (
      <span className="ml-2 font-semibold text-sm">Comments:</span>
    )}
    
    {postComments.map((comment) => (

<Comment key={comment._id} comment={comment}/>

))}

  </div>
)}

       
    </div>
  )
}
