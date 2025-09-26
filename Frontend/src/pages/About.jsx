import React, { useState, useEffect } from 'react';
import { useDataContext } from '../Context/DataProvider';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthProvider';

export default function About() {
  const { isOpenAbout, setIsOpenAbout, currUserProfile, setCurrUserProfile } = useDataContext();
  const [authUser] = useAuth();
  const [about, setAbout] = useState("");

  // Initialize with current about info
  useEffect(() => {
    if (currUserProfile?.about) {
      setAbout(currUserProfile.about);
    }
  }, [currUserProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = authUser.token || authUser.user.token;

    try {
      const response = await fetch("/api/update_Profile_Details", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ about }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.msg);
        setCurrUserProfile(prev => ({ ...prev, about }));
        setIsOpenAbout(false);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
const [loadingAI, setLoadingAI] = useState(false);
const [enhancedText, setEnhancedText] = useState(currUserProfile?.about || about || "");

const handleEnhanceAI = async () => {
  setLoadingAI(true);
  try {
    const token = authUser.token ? authUser.token : authUser.user.token;
    const response = await fetch("/api/ai/enhance_profile_ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: about }),
    });
    const data = await response.json();
    if (data.success) {
      setEnhancedText(data.enhancedText);
      setAbout(data.enhancedText);
      toast.success("Profile enhanced by AI!");
    } else {
      toast.error("Failed to enhance profile.");
    }
  } catch (err) {
    toast.error("Something went wrong.");
  }
  setLoadingAI(false);
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

        <h2 className="text-2xl font-bold mb-2">Edit About</h2>
        <p className="text-gray-600 text-sm mb-4">
          Describe your experience, skills, achievements, or previous job roles. Keep it concise and professional.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write something about yourself..."
            required
          />
  {/* AI Buttons */}
              <button
  type="button"
  onClick={handleEnhanceAI}
  className={`px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 ${loadingAI ? "opacity-50 cursor-not-allowed" : ""}`}
  disabled={loadingAI}
>
  {loadingAI ? "Enhancing..." : "Enhance with AI"}
</button>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
