import React, { useState } from 'react'
import { useDataContext } from '../Context/DataProvider';
import { useAuth } from '../Context/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../Dashboard/Loading';
export default function UpdateModel() {
       const {isOpen, setIsOpen} = useDataContext();
       const [authUser,setAuthUser]=useAuth();
        const [isLoading, setIsLoading] = useState(false);
       
          const [formData, setFormData] = useState({
        name: authUser.user.name || "",
        bio:authUser.user.bio || ""
      });
      
      const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: files ? files[0] : value,
        }));
      };
    
      const handleSubmit = async(e) => {
        const token=authUser.token?authUser.token:authUser.user.token;
                e.preventDefault();
                setIsLoading(true)
        // console.log("Form submitted:", formData);
        const response = await fetch("/api/update_UserProfile", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
        
        const data = await response.json();
        // console.log("data",data);
        setIsLoading(false)
        if(data.success){
         setAuthUser(prev => ({
  ...prev,
  ...data
}));

localStorage.setItem("auth", JSON.stringify({
  ...JSON.parse(localStorage.getItem("auth")),
  ...data
}));
         toast.success("Details Updated")
         
        }
        if(!data.success){
           toast.error(data.msg)
        }
        setTimeout(() => setIsOpen(false), 500); 
      };
    // 
  return (
   <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading && <Loading/>}
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
            <button
             onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Enter Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
               
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Enter Bio</label>
                <input
                  type="text"
                  name="bio"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
   </>
  )
}

  