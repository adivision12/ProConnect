import React, { useEffect } from 'react'
import { useDataContext } from '../Context/DataProvider';
import AllPosts from '../Users/Posts';
import NavBar from '../Dashboard/NavBar';
import ShortProfile from '../Dashboard/ShortProfile';
import Posts from '../Dashboard/Posts';
import Users from '../Dashboard/Users';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate, useParams } from 'react-router';
import img from './../assets/img.jpg'
import PostCard from '../Dashboard/PostCard';

export default function UserPosts() {
     const [allPosts, loading] = AllPosts();
     const {showAllPosts,currUserProfile,setCurrUserProfile}=useDataContext();
  const [authUser,setAuthUser]=useAuth();
   const navigate=useNavigate();
    //  console.log(showAllPosts);

const { id } = useParams();

    useEffect(()=>{
          if(id){
 const getUserProfile=async()=>{
            let result = await fetch(`/api/getProfile?id=${id}`, {
                method: "GET",
                Credentials:"include",
                headers:{
                    'Content-Type': 'application/json'
                },
            })
             const data = await result.json();
            // console.log("data",data);

            setCurrUserProfile(data.profile);
            // setLoading(false);
         
        }
               getUserProfile();
      }
       },[id])
    let posts;
      if( allPosts){
        posts=allPosts.filter((post)=>{
      if(post.userId._id===id){
        return post;
      }
     })
      }
   
      useEffect(() => {
  if (!posts) {
    
    navigate(`/userProfile/${id}`);
  }
}, [posts]);
      // console.log(posts)
  return (
    
    <div className="bg-gray-100 min-h-screen">
  <NavBar />

  <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">

    {/* Profile Card */}
    {currUserProfile && <div
  onClick={() => {
    if(currUserProfile?.userId?._id===authUser?.user?._id){
      navigate(`/profile`)
    }else{
      navigate(`/userProfile/${id}`)
    }
  }}
  className="hidden lg:block w-full h-[50%] sm:w-[90%] md:w-[60%] lg:w-[25%] border bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer relative"
>
  {/* Cover Image */}
  <div className="h-20 w-full rounded overflow-hidden">
    <img className="h-full w-full object-cover" src={currUserProfile?.coverPicture} alt="Cover" />
  </div>

  {/* Profile Picture */}
  <div className="flex ml-6">
    <img
      src={currUserProfile?.userId?.profilePicture}
      alt="Profile"
      className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover absolute top-[60px]"
    />
  </div>

  {/* Space for profile image overlap */}
  <div className="mt-14 ml-2">
    <h1 className="text-2xl font-semibold">{currUserProfile?.userId?.name || ''}</h1>
    <p className="text-gray-700">{currUserProfile?.userId?.bio || ''}</p>
    <p className="text-sm text-gray-500">Kanpur, Uttar Pradesh</p>
    <p className="font-bold mt-1">Vision Institute of Technology, Kanpur</p>
  </div>
</div>}


    {/* Posts Section */}
    <div className="w-full lg:w-[50%] h-[90vh] overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl font-bold border bg-white p-4 rounded-lg shadow mb-6">
        All Posts
      </h1>

      {/* Posts List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) :posts && posts.length === 0 ? (
        <div className="border bg-white p-4 rounded-lg shadow text-center text-gray-600">
          No posts
        </div>
      ) : (
       posts && posts.map((post) => (
         <PostCard post={post} key={post._id}/>
        
        ))
      )}
    </div>
  </div>
</div>

  )
}
