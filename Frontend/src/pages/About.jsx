import React, { useState } from 'react'
import { useDataContext } from '../Context/DataProvider'
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthProvider';

export default function About() {
    const {isOpenAbout,setIsOpenAbout}=useDataContext();
    const [authUser,setAuthUser]=useAuth();
    const [about,setAbout]=useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();
     const token=authUser.token?authUser.token:authUser.user.token;
                e.preventDefault();
        const response = await fetch("/api/update_Profile_Details", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({about}),
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
   
    
    // window.location.reload();
  };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
            <button
             onClick={() => setIsOpenAbout(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit About</h2>
            <hr />
            <p className='text-md text-gray-600'>You can write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.z</p>
            <br />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
               
                <textarea
                  type="text"
                  name="about"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={6}
                  value={about}
                  onChange={(e)=>setAbout(e.target.value)}
                  required
                />
              </div>
           
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAbout(false)}
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
  )
}
