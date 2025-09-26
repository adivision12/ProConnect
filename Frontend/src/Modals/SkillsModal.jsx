import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthProvider";
import { useDataContext } from "../Context/DataProvider";
// Skills Modal
export function SkillsModal({ isOpen, setIsOpen, existingSkills = [], onSave }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [authUser] = useAuth();
  const closeModal = () => setIsOpen(false);
    const {currUserProfile,setCurrUserProfile}=useDataContext();


useEffect(() => {
    setSkills(existingSkills);
  }, [existingSkills]);


    const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (onSave) onSave(skills);
    const token=authUser.token?authUser.token:authUser.user.token;      
      const response = await fetch("/api/update_Profile_Details", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({skills}),
        })
        
        const data = await response.json();
        // console.log("data",data);
        if(data.success && data.profile){
            setCurrUserProfile(data.profile);
        }
    toast.success("Skills updated!");
    closeModal();
  };

  if (!isOpen) return null;
  // console.log("skills modal rendered with skills:", skills);

  return (
    <div className="px-4 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Manage Skills</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              {skill} 
              <span onClick={() => removeSkill(idx)} className="cursor-pointer">&times;</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Add a new skill"
          />
          <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
        </div>

        <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Skills</button>
      </div>
    </div>
  );
}

// Achievements Modal
export function AchievementsModal({ isOpen, setIsOpen, existingAchievements = [], onSave }) {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [authUser] = useAuth();
    const {currUserProfile,setCurrUserProfile}=useDataContext();

  useEffect(() => {
    setAchievements(existingAchievements);
  }, [existingAchievements]);
  const closeModal = () => setIsOpen(false);

  const addAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (idx) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (onSave) onSave(achievements);
     const token=authUser.token?authUser.token:authUser.user.token;      
      const response = await fetch("/api/update_Profile_Details", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
                 authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({achievements}),
        })
        
        const data = await response.json();
        // console.log("data",data);
        // setAchievements(data.profile.achievements);
        if(data.success && data.profile){
            setCurrUserProfile(data.profile);
        }
    toast.success("Achievements updated!");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Manage Achievements</h2>

        <ul className="space-y-2 mb-4">
          {achievements.map((ach, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded">
              {ach} <span onClick={() => removeAchievement(idx)} className="cursor-pointer">&times;</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Add a new achievement"
          />
          <button onClick={addAchievement} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
        </div>

        <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Achievements</button>
      </div>
    </div>
  );
}
