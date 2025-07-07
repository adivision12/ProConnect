import React, { useState } from 'react'
import { useDataContext } from '../Context/DataProvider';
import { useAuth } from '../Context/AuthProvider';
import toast from 'react-hot-toast';
import Loading from './Loading';

export default function CreatePost() {
    const {postForm, setPostForm} = useDataContext();
    const [isLoading, setIsLoading] = useState(false);
   const [authUser] = useAuth();
    const [formData, setFormData] = useState({
      body: '',
      media: '',
    });
  
    
  
    const handleInputChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    };
  
    const handleSubmit = async (e) => {
      
      e.preventDefault();
      const token = authUser.token || authUser.user.token;
  setIsLoading(true)
      const postData = new FormData();
      postData.append('media', formData.media);
      postData.append('body', formData.body);
  
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: postData,
      });
  
      const data = await response.json();
      // console.log(data);
      // window.location.reload();
      setIsLoading(false);
       if(data.success){
              toast.success(data.msg)
          }
          if(!data.success){
             toast.error(data.msg)
          }
           setTimeout(() => {
            setPostForm(false)
            window.location.reload();
           }, 500); 
  
    };
    
  return (
   <>
   
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       {isLoading && (
 <Loading/>
)}
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
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
        </>
  )
}
