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
     const {showAllPosts,currUserProfile}=useDataContext();
  const [authUser,setAuthUser]=useAuth();
   const navigate=useNavigate();
    //  console.log(showAllPosts);

const { id } = useParams();
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
    
    navigate(`userProfile/${id}`);
  }
}, [posts]);
      // console.log(posts)
  return (
    // <div className='bg-gray-200 ' >
    //         <NavBar/>
    //         <div className=' flex flex-col lg:flex-row w-full m-auto '>
    //              <div onClick={()=>navigate("/profile")} className='h-[50%] sm:w-[90%] md:w-[60%] lg:w-[25%] w-[50%]  border-2 p-6 bg-white mx-auto lg:ml-2 my-6 ounded-lg'>
    //                   <div className='h-[80px]  rounded'> <img className='h-full rounded' src={img} /></div>
    //                   <img src={ `/api/uploads/${authUser?authUser.user.profilePicture:''}`} alt="" className='rounded-full h-[80px] border-black w-[80px] relative top-[-35px] left-[20px]' />
    //                   <span>
    //                    <h1 className='text-3xl font-semibold'>{authUser?authUser.user.name:''}</h1>
    //                    <p>{authUser?authUser.user.bio:''} </p>
    //                    <p className='text-sm text-gray-500'>Kanpur,Uttar Pradesh</p>
    //                    <p className='font-bold'>Vision Institute of Technology, Kanpur</p>
    //                   </span>
    //                </div>
               
    //              <div className="w-[90%] lg:w-[50%] h-screen overflow-scroll scrollbar-hide">
    //               <h1 className='text-2xl font-bold border-2 p-6 bg-white m-6 rounded-lg shadow-sm '> All Posts</h1>
    //                  {/* Display Posts */}
    //                  {loading ? (
    //                    <p className="text-center text-gray-500">Loading posts...</p>
    //                  ) : allPosts.length === 0 ? (
    //                    <div className="border-2 p-6 bg-white m-6 rounded-lg shadow-sm">
    //                      No posts
    //                    </div>
    //                  ) : (
    //                    allPosts.map((post) => (
    //                      <div onClick={()=>postClick(post.userId._id)}            key={post._id}
    //                        className="border-2 p-6 bg-white m-6 rounded-lg shadow-sm"
    //                      >
    //                        <div className="flex items-start">
    //                          <img
    //                            src={ `/api/uploads/${post.userId.profilePicture}`} 
    //                            alt="Profile"
    //                            className="border border-gray-300 rounded-full h-16 w-16 object-cover "
    //                          />
    //                          <div className="ml-4">
    //                            <h1 className="font-bold text-lg">{post.userId.name}</h1>
    //                            <p className="text-sm text-gray-600">{post.userId.bio}</p>
    //                            <p className="text-xs text-gray-500">4 days ago</p>
    //                          </div>
    //                        </div>
    //                         <div className="mt-4 text-sm text-gray-800">
    //                          {post.body}
    //                          <span className="text-blue-600 cursor-pointer hover:underline">
    //                            &nbsp;Read more...
    //                          </span>
    //                        </div>
    //                        <br />
    //                      {post.media &&  <div>
    //                          <img className='rounded h-[200px] w-[70%] mx-auto' src={`/api/uploads/${post.media}`} alt="" />
    //                        </div>}
                          
    //                      </div>
    //                    ))
    //                  )}
               
                
    //                </div>
    //         </div>
    
    //     </div>
    <div className="bg-gray-100 min-h-screen">
  <NavBar />

  <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">

    {/* Profile Card */}
    <div
  onClick={() => navigate("/profile")}
  className="hidden lg:block w-full h-[50%] sm:w-[90%] md:w-[60%] lg:w-[25%] border bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer relative"
>
  {/* Cover Image */}
  <div className="h-20 w-full rounded overflow-hidden">
    <img className="h-full w-full object-cover" src={img} alt="Cover" />
  </div>

  {/* Profile Picture */}
  <div className="flex ml-6">
    <img
      src={authUser?.user?.profilePicture}
      alt="Profile"
      className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover absolute top-[60px]"
    />
  </div>

  {/* Space for profile image overlap */}
  <div className="mt-14 ml-2">
    <h1 className="text-2xl font-semibold">{authUser?.user?.name || ''}</h1>
    <p className="text-gray-700">{authUser?.user?.bio || ''}</p>
    <p className="text-sm text-gray-500">Kanpur, Uttar Pradesh</p>
    <p className="font-bold mt-1">Vision Institute of Technology, Kanpur</p>
  </div>
</div>


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
