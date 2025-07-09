import React, { useEffect, useState } from 'react'
import NavBar from '../Dashboard/NavBar'
import dp from './../assets/dp.jpg'
import { useAuth } from '../Context/AuthProvider';
import img from './../assets/img2.jpg'
import img2 from './../assets/img.jpg'
import UpdateModel from './UpdateModel';
import { useDataContext } from '../Context/DataProvider';
import { Navigate, useNavigate } from 'react-router';
import AllPosts from '../Users/Posts';
import AllUsers from '../Users/Users';
import useController from '../stateManagement/useController';
import PostCard from '../Dashboard/PostCard';
import { useConnections } from '../Context/ConnectionsProvider';
import toast from 'react-hot-toast';
 import { useParams } from 'react-router-dom';


export default function UserProfile() {
 
const { id } = useParams();
   const {connectionRequests,myConnections} =useConnections(); 
       const [authUser,setAuthUser]=useAuth();
       const [allPosts, loading] = AllPosts();
       const {setShowAllPosts, currUserProfile,setCurrUserProfile} = useDataContext();
       const [tempSendReqId, setTempSendReqId] = useState(id);

const navigate=useNavigate();
    const [isConnect,setIsConnect]=useState(false);
    const [isWithdraw,setIsWithdraw]=useState(false);
    const {selected}=useController();
  
    // console.log("connectionRequests",connectionRequests)
     const sendReq = connectionRequests?.find(
    (connReq) => connReq.connectionId._id === currUserProfile?.userId._id
  ) 
  const receiveReq=myConnections.find((myConn)=> myConn.userId._id===currUserProfile?.userId._id)
// console.log(receiveReq)
// console.log(sendReq)
// if(receiveReq && receiveReq.status_accepted===null) console.log("accept")
// if(receiveReq && receiveReq.status_accepted || sendReq && sendReq.status_accepted) console.log("connected")
// if(sendReq && sendReq.status_accepted===null) console.log("pending")
async function handleRequest(e,id) {
    const token=authUser?.token?authUser.token:authUser?.user.token;
    
    let result = await fetch("/api/user/accept_connection_req", {
                  method: "post",
                  Credentials:"include",
                  headers:{
                    'Content-Type': 'application/json',
                      authorization:`Bearer ${token}`,
                  },
                  body:JSON.stringify({action:e.target.name,requestId:id})
              })
               const data = await result.json();
              //  console.log(data)
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
      
  // console.log(currUserProfile)
 
let myPosts;
if(currUserProfile){
        myPosts=allPosts.filter((posts)=>{
    if(posts.userId._id===id){
      return posts;
    }
  })
  // console.log(myPosts)
  
}

async function sendConnectionReq(id){
  setIsWithdraw(false);
  setIsConnect(true);
  const token=authUser.token?authUser.token:authUser.user.token;
   const response = await fetch("/api/user/send_Connection_req", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,

            },
            body: JSON.stringify({connectionId:id}),
        })
        
        const data = await response.json();
        // console.log(data);
          if(data.success){
                    toast.success(data.msg)
                    // setTempSendReqId(data.newReq._id)
                }
                if(!data.success){
                   toast.error(data.msg)
                }
                 

        
}
async function withdrawConnectionReq(){
 const id=tempSendReqId;
  // console.log("id",id)
setIsWithdraw(true)
  const token=authUser.token?authUser.token:authUser.user.token;
   const response = await fetch("/api/user/withdraw_connection_req", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,

            },
            body: JSON.stringify({connectionId:id}),
        })
        
        const data = await response.json();
        // console.log(data);
          if(data.success){
                    toast.success(data.msg)
                }
                if(!data.success){
                   toast.error(data.msg)
                }
                 

        
}
async function removeConnection(id1,id2){
   if(!id2){
    id2=tempSendReqId;
  }
  if(!id1) id1=authUser.user._id;
  // console.log(id2)
setIsWithdraw(true)
  if(id1 && id2){
    // console.log(id1,"  ",id2)
    const token=authUser.token?authUser.token:authUser.user.token;
   const response = await fetch("/api/user/removeConnection", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,

            },
            body: JSON.stringify({id:{id1,id2}}),
        })
        
        const data = await response.json();
        // console.log(data);
          if(data.success){
                    toast.success(data.msg)
                }
                if(!data.success){
                   toast.error(data.msg)
                }
  }               
  // toast.error("something error")
}
const openPosts=(id2)=>{
        // setShowAllPosts(id);
        navigate(`/userProfile/${id2}/posts`)
      }
        
      // console.log(selected)
   
      
  return (
   <div className="bg-gray-100 font-sans">

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
          
           {currUserProfile?.coverPicture ? (<img src={currUserProfile.coverPicture}  alt="cover" className="w-full h-40 object-cover" />
)           : <img src={img2} alt="cover" className="w-full h-40 object-cover" />}
          <div className="absolute left-6 -bottom-10">
            {/* <i className="fa-solid fa-plus  rounded-full p-3 hover:bg-pink-50 "></i> */}
            <img  src={currUserProfile?.userId?.profilePicture} alt="profile" className="rounded-full h-[120px] w-[120px] border-4 border-white" />
            
            <div className="absolute -top-2 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-full">
              #OPENTOWORK
            </div>
          </div>
        </div>

        <div className="p-6 pt-14">
          
           <div className='flex justify-between'><h2 className="text-2xl font-bold">{currUserProfile?currUserProfile.userId.name:''} <span className="text-sm font-normal">(He/Him)</span></h2></div>
          <p>
           {currUserProfile?currUserProfile.userId.bio:''}
          </p>
          <p className="text-sm text-gray-500 mt-1">Kanpur, Uttar Pradesh, India • 369 connections</p>
         <div className="mt-4 flex flex-wrap gap-2">
 { isWithdraw && <button
      onClick={() => sendConnectionReq(currUserProfile.userId._id)}
      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
    >
      Connect
    </button>}
{!isWithdraw && currUserProfile && (() => {
  if (receiveReq && receiveReq.status_accepted === null) {
    return (
      <button
      name='accept'
        onClick={(e)=>{handleRequest(e,receiveReq._id)}}
        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
      >
        Accept
      </button>
    );
  }
  if (isConnect || sendReq && sendReq.status_accepted === null) {
    return (
      <button
        onClick={() => withdrawConnectionReq()}
        className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
      >
        Pending
      </button>
    );
  }
  if (receiveReq && receiveReq.status_accepted || sendReq && sendReq.status_accepted) {
    return (
    <>
      <button
        
        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
      >
        Connected
      </button>
       <button
        onClick={() => removeConnection(authUser?.user._id,currUserProfile?.userId.id)}
        className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
      >
        Unfollow
      </button></>
    );
  }



  return (
    <button
      onClick={() => sendConnectionReq(currUserProfile.userId._id)}
      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
    >
      Connect
    </button>
  );
})()}


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
{currUserProfile?.about && <section  className="bg-white rounded-xl shadow p-6 mt-6">
     <div className='flex justify-between'> <h2 className="text-2xl font-bold mb-4">About</h2>
   
     </div>
      <p> {currUserProfile?.about || ""}</p>
    </section>}
  
     { <section className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {(myPosts && myPosts.length>0 )?
        <div className="space-y-6">
         
          <PostCard post={myPosts[0]}/>
           <div onClick={()=>openPosts(currUserProfile.userId._id)} className='cursor-pointer  hover:text-blue-600 text-center text-lg  '>
          Show All Posts  <i className=" fa-solid fa-arrow-right"></i>
        </div>
        </div>:
        <div>No Posts</div>
        }
      </section>
  }
<section className="bg-white rounded-xl shadow p-6 mt-6">
      <div className='flex justify-between'><h2 className="text-2xl font-bold mb-4">Experience</h2> <div className='text-2xl'> </div></div>
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
      <div className='flex  justify-between'><h2 className="text-2xl font-bold mb-4">Education</h2> <div className='text-2xl'> </div></div>
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

  
    
     </div>
              
  )
}
