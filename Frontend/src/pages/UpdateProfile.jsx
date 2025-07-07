import React, { useState, useEffect } from 'react';
import { useDataContext } from '../Context/DataProvider';
import { useAuth } from '../Context/AuthProvider';
import toast from 'react-hot-toast';
import Loading from '../Dashboard/Loading';
// import axios from 'axios';

const UpdateProfile = () => {
    const [authUser,setAuthUser]=useAuth();
  const [formData, setFormData] = useState({
    education: [{ school: '', degree: '', fieldOfStudy: '' }],
    pastWork: [{ company: '', position: '', years: '' }],
  });
 const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const {currUserProfile,openUpdateEduForm,setOpenUpdateEduForm}=useDataContext();
  // Optional: Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
       if(currUserProfile){
         setFormData({
          education: currUserProfile.education || [],
          pastWork: currUserProfile.pastWork || [],
        });
       }
    };

    fetchProfile();
  },[]);

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;
    const updatedSection = [...formData[section]];
    updatedSection[index][name] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addField = (section) => {
    const emptyItem =
      section === 'education'
        ? { school: '', degree: '', fieldOfStudy: '' }
        : { company: '', position: '', years: '' };

    setFormData({ ...formData, [section]: [...formData[section], emptyItem] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

     const token=authUser.token?authUser.token:authUser.user.token;
                e.preventDefault();
                setIsLoading(true)
        // console.log("Form submitted:", formData);
        const response = await fetch("/api/update_Profile_Details", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
        
        const data = await response.json();
        // console.log(data);
        setIsLoading(false)
         if(data.success){
            toast.success(data.msg)
        }
        if(!data.success){
           toast.error(data.msg)
        }
         setTimeout(() => {
        setOpenUpdateEduForm(false);
        window.location.reload();
         }, 500); 
   
    
    // window.location.reload();
  };

  const handleDelete = async (section, id) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item._id !== id),
    }));
};

//   console.log(formData.education.length)
  return (

     (
 <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  onClick={() => setOpenUpdateEduForm(false)}
>
  {isLoading && <Loading/>}
  <div
    className="bg-white rounded-xl shadow-xl w-[90%] max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
    onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
  >
    <h2 className="text-2xl font-bold mb-6">Update Education and Past Work</h2>

    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Education Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Education</h3>
        {formData.education.map((edu, index) => edu && (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4"
          >
            <input
              type="text"
              name="school"
              placeholder="School"
              value={edu.school}
              onChange={(e) => handleInputChange(e, 'education', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleInputChange(e, 'education', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              name="fieldOfStudy"
              placeholder="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) => handleInputChange(e, 'education', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => handleDelete('education', edu._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addField('education')}
          className="text-blue-600 hover:underline mt-2"
        >
          + Add more education
        </button>
      </div>

      {/* Past Work Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Past Work</h3>
        {formData.pastWork.map((work, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4"
          >
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={work.company}
              onChange={(e) => handleInputChange(e, 'pastWork', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={work.position}
              onChange={(e) => handleInputChange(e, 'pastWork', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              name="years"
              placeholder="Years"
              value={work.years}
              onChange={(e) => handleInputChange(e, 'pastWork', index)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => handleDelete('pastWork', work._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addField('pastWork')}
          className="text-blue-600 hover:underline mt-2"
        >
          + Add more work
        </button>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpenUpdateEduForm(false)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>

      {/* Success Message */}
      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </form>
  </div>
</div>

     )
  );
};

export default UpdateProfile;
