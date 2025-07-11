import React, { useEffect, useState } from 'react'
import NavBar from '../Dashboard/NavBar'
import { useAuth } from '../Context/AuthProvider';
import img2 from './../assets/img.jpg'
import UpdateModel from './UpdateModel';
import { useDataContext } from '../Context/DataProvider';
import AllPosts from '../Users/Posts';
import UpdateProfile from './UpdateProfile';
import { useNavigate } from 'react-router';
import PostCard from '../Dashboard/PostCard';
import toast, { Toaster } from 'react-hot-toast';
import CreatePost from '../Dashboard/CreatePost';
import About from './About';
import Loading from '../Dashboard/Loading';
import { useConnections } from '../Context/ConnectionsProvider';

export default function Profile() {
       const [authUser,setAuthUser]=useAuth();
        const [isLoading, setIsLoading] = useState(false);
       const {isOpen, setIsOpen,location,isOpenAbout,setIsOpenAbout,openUpdateEduForm,setOpenUpdateEduForm,currUserProfile,setCurrUserProfile} = useDataContext();
       const [allPosts] = AllPosts();
       const [openProfile,setOpenProfile]=useState(false);
       const [openCover,setOpenCover]=useState(false);
       
      const [formData, setFormData] = useState({
    profilePicture: null,
    coverPicture:null,
  });
  const {postForm, setPostForm} = useDataContext();
const navigate=useNavigate();
  const myPosts=allPosts.filter((posts)=>{
    if(posts.userId._id===authUser.user._id){
      return posts
    }
  })
  // console.log(myPosts)
  // console.log(currUserProfile)
   const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: files ? files[0] : value,
        }));
      };
    const updateEducation=async()=>{
      // console.log(id);
      setOpenUpdateEduForm(true);
    }
      const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        const token=authUser.token?authUser.token:authUser.user.token;
        // console.log("Form submitted:", formData);
          const imgData = new FormData();
  if(formData.profilePicture){
    imgData.append("profilePicture", formData.profilePicture);
  }
 
  if(formData.coverPicture){
     imgData.append("coverPicture", formData.coverPicture);
  }
 
  
        const response = await fetch("/api/upload_Profile", {
            method: "POST",
            headers: {
                // 'Content-Type': 'application/json',
                authorization:`Bearer ${token}`,
            },
            
            body: (imgData),
        })
        
        const data = await response.json();
        setIsLoading(false)
        // console.log(data);

         if(data.success){
         setAuthUser(prev => ({
  ...prev,
  ...data
}));

localStorage.setItem("auth", JSON.stringify({
  ...JSON.parse(localStorage.getItem("auth")),
  ...data
}));
         toast.success("Profile Picture Updated") 
        }
      
        if(!data.success){
           toast.error(data.msg)
        }
         setTimeout(() =>{ setOpenProfile(false)
          setOpenCover(false);
         }, 500); 
        
      };

      const openPosts=(id)=>{
       
        navigate(`/userProfile/${id}/posts`)
      }
    
 const imagePreview = formData.profilePicture
        ? URL.createObjectURL(formData.profilePicture)
        : authUser.user.profilePicture;

        let coverPreview;
  // if(formData.coverPicture){
    coverPreview = formData.coverPicture
        ? URL.createObjectURL(formData.coverPicture)
        : authUser.img;
  // }
const id=authUser.user._id;
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
           const {myConnections}=useConnections();
       const acceptedConnections = myConnections?.filter(
  (conn) => conn.status_accepted === true
);
const connections = acceptedConnections?.map(conn => {
  const otherUser = conn.userId._id === authUser?.user._id ? conn.connectionId : conn.userId;
  return otherUser;
});
      //  console.log(currUserProfile)
  return (
//    
   <div className="bg-gray-100 font-sans">
    <Toaster/>
  <NavBar/>
  <div className="max-w-6xl mx-auto p-6">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <aside className="hidden lg:block bg-white p-4 rounded-xl shadow col-span-1">
        <h3 className="font-semibold mb-2">Open to work</h3>
        <p className="text-sm text-gray-600 mb-1">Unemployed roles</p>
        <a href="#" className="text-blue-600 text-sm">Show details</a>
      </aside>

      <div className="bg-white rounded-xl shadow col-span-2 relative overflow-hidden">
        <div className="relative">
          
          <div className="relative">
     {authUser?.img ? <img src={authUser.img}  alt="cover" className="w-full h-40 object-cover rounded-t-xl" />:
     <img src={img2} alt="cover" className="w-full h-40 object-cover rounded-t-xl" />}
  
  {/* Camera icon in top-right corner */}
  <div
    className="absolute top-2 right-2 bg-white text-gray-700 hover:bg-gray-100 p-2 rounded-full shadow cursor-pointer"
    title="Change background image"
    onClick={() => setOpenCover(true)} // Or any handler
  >
    <i className="fa-solid fa-camera text-lg"></i>
  </div>
</div>
          <div className="absolute left-6 -bottom-10">
            {/* <i className="fa-solid fa-plus  rounded-full p-3 hover:bg-pink-50 "></i> */}
            <img onClick={()=>setOpenProfile(true)} src={authUser.user.profilePicture} alt="profile" className="rounded-full h-[120px] w-[120px] border-4 border-white" />
            
            <div className="absolute -top-2 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-full">
              #OPENTOWORK
            </div>
          </div>
        </div>


        <div className="p-6 pt-14">
          
           <div className='flex justify-between'><h2 className="text-2xl font-bold">{authUser.user.name} <span className="text-sm font-normal">(He/Him)</span></h2><i onClick={() => setIsOpen(true)} className="text-xl  fa-solid fa-pencil rounded-full p-2 hover:bg-gray-100"></i></div>
          <p>
           {authUser.user.bio}
          </p>
          <p className="text-sm text-gray-500 mt-1">{location ||"No location avl"}</p>
          <p className="text-sm text-blue-500 mt-1 font-semibold"> {connections?.length} connections</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">Open to</button>
           <a href="#enhanceProfile"> <button className="border border-gray-400 px-4 py-2 rounded-full text-sm">Enhance profile</button></a>
          </div>
        </div>
      </div>

      <aside className="hidden lg:block bg-white p-4 rounded-xl shadow col-span-1">
        <h4 className="font-semibold mb-2 text-sm">Promoted</h4>
        <div className="border p-3 rounded-lg">
          <p className="text-sm font-semibold">Mount Roofing &amp; Structure</p>
          <p className="text-xs text-gray-600 mt-1">
            India’s No.1 Sandwich Puf Panel Manufacturers
          </p>
          <button className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded-full">Follow</button>
        </div>
      </aside>
    </div>

   <section  className="bg-white rounded-xl shadow p-6 mt-6">
     <div className='flex justify-between'> <h2 className="text-2xl font-bold mb-4">About</h2>
     <i onClick={()=>setIsOpenAbout(true)} className="fa-solid text-lg fa-pencil rounded-full p-3 hover:bg-gray-50"></i>
     </div>
      <p> {currUserProfile?.about || ""}</p>
    </section>
    {isOpenAbout && <About/>}
   <section  className="bg-white rounded-xl shadow p-6 mt-6">
     <div className='flex justify-between'> <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <div onClick={()=>setPostForm(true)} className="text-blue-600 border-2 font-semibold  border-blue-600 p-1 text-md h-9 rounded-3xl  hover:bg-blue-50"> Create a post</div></div>
      {postForm && (
              <CreatePost/>
            )}
      { myPosts.length>0 ?
       <div className="space-y-6">
        
        <PostCard post={myPosts[0]}/>
        <div onClick={()=>openPosts(authUser.user._id)} className='text-center text-lg  '>
          Show All Posts  <i className=" fa-solid fa-arrow-right"></i>
        </div>
      </div>:
      // 
    
        <div>No Post</div>
      
      }
    </section>

    <section id='enhanceProfile' className="bg-white rounded-xl shadow p-6 mt-6">
      <div className='flex justify-between'><h2 className="text-2xl font-bold mb-4">Experience</h2> <div className='text-2xl'> <i onClick={updateEducation} className="fa-solid fa-pencil rounded-full p-3 hover:bg-gray-50"></i></div></div>
      <div className="space-y-6">
        {(currUserProfile && currUserProfile.pastWork.length>0) ?  currUserProfile.pastWork.map((work)=>{
          return <div key={work._id} className="border-l-4 border-blue-600 pl-4">
          <h3 className="text-xl font-semibold">{work.position}</h3>
          <p className="text-sm text-gray-500">{work.years+" Years"}</p>
          <p className="mt-2 text-gray-700 text-md font-bold">
          {"At "+work.company}
          </p>
        </div>
        }): <div key={102} className="border-l-4 border-blue-600 pl-4">
          <h3 className="text-xl font-semibold">No Experience</h3>
        </div>
        }
        
      </div>
    </section>

    <section className="bg-white rounded-xl shadow p-6 mt-6 mb-12">
      <div className='flex  justify-between'><h2 className="text-2xl font-bold mb-4">Education</h2> <div className='text-2xl'> <i onClick={updateEducation} className="fa-solid fa-pencil rounded-full p-3 hover:bg-gray-50"></i></div></div>
      <div className="space-y-6">
       { (currUserProfile  && currUserProfile.education.length>0) ?  currUserProfile.education.map((edu)=>{ return edu && <div key={edu._id} className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold">{edu?edu.school:""}</h3>
          <p className="text-sm text-gray-500">
         {edu.degree}
          </p>
          <a href="#" className="mt-2 inline-block text-blue-600 text-sm">
           {edu.fieldOfStudy}
          </a>
        </div>}):<div key={103} className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold">No Education</h3>
        
        </div>}
        
      </div>
    </section>
  </div>

  
      {isOpen && (<UpdateModel/>
        
      )}
     {openProfile && 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {isLoading && 
        <Loading/>}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenProfile(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Update Your Profile Picture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
          
              <div>
                
               
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="DP Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
                
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenProfile(false)}
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
     {openCover && 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         {isLoading && 
        <Loading/>}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenCover(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Update Your Cover Picture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
          
              <div>
                
               
                <label className="block text-sm font-medium mb-1">Cover Picture</label>
                <input
                  type="file"
                  name="coverPicture"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                <br />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="DP Preview"
                    className="mt-2 w-[50%] h-12 rounded-lg object-cover"
                  />
                )}
                
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenCover(false)}
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
   { openUpdateEduForm  && <UpdateProfile  />}
     </div>
              
  )
}
